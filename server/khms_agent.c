// khms_agent.c - Posts kernel metrics JSON to backend API
#define _POSIX_C_SOURCE 200809L
#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>

// Helper: Format timestamp as ISO 8601 UTC
void get_iso8601_timestamp(char *buf, size_t len) {
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    struct tm tm;
    gmtime_r(&ts.tv_sec, &tm);
    strftime(buf, len, "%Y-%m-%dT%H:%M:%SZ", &tm);
}

// Read CPU PSI (avg10 values)
int read_psi_cpu(double *some, double *full) {
    FILE *fp = fopen("/proc/pressure/cpu", "r");
    if (!fp) return -1;

    char line[256];
    *some = *full = 0.0;
    while (fgets(line, sizeof(line), fp)) {
        if (strncmp(line, "some", 4) == 0) {
            sscanf(line, "some avg10=%lf", some);
        } else if (strncmp(line, "full", 4) == 0) {
            sscanf(line, "full avg10=%lf", full);
        }
    }
    fclose(fp);
    return 0;
}

// Read blocked processes
int read_procs_blocked(long *blocked) {
    FILE *fp = fopen("/proc/stat", "r");
    if (!fp) return -1;

    char line[256];
    *blocked = -1;
    while (fgets(line, sizeof(line), fp)) {
        if (sscanf(line, "procs_blocked %ld", blocked) == 1) {
            break;
        }
    }
    fclose(fp);
    return (*blocked == -1) ? -1 : 0;
}

// Read context switch counter
long read_ctxt(void) {
    FILE *fp = fopen("/proc/stat", "r");
    if (!fp) return -1;

    char line[256];
    long ctxt = -1;
    while (fgets(line, sizeof(line), fp)) {
        if (sscanf(line, "ctxt %ld", &ctxt) == 1) {
            break;
        }
    }
    fclose(fp);
    return ctxt;
}

// Sleep for 1 second
void sleep_1s(void) {
    struct timespec req = {1, 0};
    struct timespec rem;
    while (nanosleep(&req, &rem) == -1 && errno == EINTR) {
        req = rem;
    }
}

int main() {
    while (1) {
        long ctxt1 = read_ctxt();
        sleep_1s();
        long ctxt2 = read_ctxt();

        double psi_some, psi_full;
        read_psi_cpu(&psi_some, &psi_full);

        long blocked;
        read_procs_blocked(&blocked);

        double cs_rate = (double)(ctxt2 - ctxt1);
        char timestamp[32];
        get_iso8601_timestamp(timestamp, sizeof(timestamp));

        // Send JSON to backend via curl
        FILE *fp = popen("curl -s -X POST -H 'Content-Type: application/json' -d @- http://localhost:3000/api/health", "w");
        if (fp) {
            fprintf(fp, "{\n");
            fprintf(fp, "  \"timestamp\": \"%s\",\n", timestamp);
            fprintf(fp, "  \"cpu_psi\": {\n");
            fprintf(fp, "    \"some\": %.3f,\n", psi_some);
            fprintf(fp, "    \"full\": %.3f\n", psi_full);
            fprintf(fp, "  },\n");
            fprintf(fp, "  \"context_switch_rate\": %.1f,\n", cs_rate);
            fprintf(fp, "  \"blocked_processes\": %ld\n", blocked);
            fprintf(fp, "}\n");
            pclose(fp);
        }

        sleep_1s(); // push every 2s
    }

    return 0;
}
