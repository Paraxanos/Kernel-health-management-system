// khms_agent.c - Day 3: Full metric collection + JSON output
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

// Read procs_blocked
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

// Sleep for 1 second precisely
void sleep_1s(void) {
    struct timespec req = {1, 0};
    struct timespec rem;
    while (nanosleep(&req, &rem) == -1 && errno == EINTR) {
        req = rem;
    }
}

int main() {
    // 1. Read initial context switches
    long ctxt1 = read_ctxt();
    if (ctxt1 == -1) {
        fprintf(stderr, "Failed to read initial ctxt\n");
        return EXIT_FAILURE;
    }

    // 2. Sleep 1s
    sleep_1s();

    // 3. Read final context switches and other metrics
    long ctxt2 = read_ctxt();
    if (ctxt2 == -1) {
        fprintf(stderr, "Failed to read final ctxt\n");
        return EXIT_FAILURE;
    }

    double psi_some, psi_full;
    if (read_psi_cpu(&psi_some, &psi_full) != 0) {
        fprintf(stderr, "Failed to read PSI\n");
        return EXIT_FAILURE;
    }

    long blocked;
    if (read_procs_blocked(&blocked) != 0) {
        fprintf(stderr, "Failed to read blocked processes\n");
        return EXIT_FAILURE;
    }

    // 4. Compute rate
    double cs_rate = (double)(ctxt2 - ctxt1); // per second

    // 5. Timestamp
    char timestamp[32];
    get_iso8601_timestamp(timestamp, sizeof(timestamp));

    // 6. Output valid JSON (matching schema)
    printf("{\n");
    printf("  \"timestamp\": \"%s\",\n", timestamp);
    printf("  \"cpu_psi\": {\n");
    printf("    \"some\": %.3f,\n", psi_some);
    printf("    \"full\": %.3f\n", psi_full);
    printf("  },\n");
    printf("  \"context_switch_rate\": %.1f,\n", cs_rate);
    printf("  \"blocked_processes\": %ld\n", blocked);
    printf("}\n");

    return EXIT_SUCCESS;
}