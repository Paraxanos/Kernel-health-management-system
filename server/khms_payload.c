// khms_payload.c - Adaptive stress utility for KHMS testing
// Supports CPU pressure and context-switch storms.
// Usage: ./khms_payload <mode> [--threads=N] [--duration=S]
// Modes: cpu, cs

#define _POSIX_C_SOURCE 200809L
#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <signal.h>
#include <string.h>
#include <errno.h>

volatile sig_atomic_t stop = 0;

void handle_sigint(int sig) {
    (void)sig;
    stop = 1;
}

// CPU pressure: tight floating-point loop
void* cpu_worker(void* arg) {
    (void)arg;
    while (!stop) {
        volatile double x = 1.0;
        for (int i = 0; i < 1000000 && !stop; i++) {
            x *= 1.0001;
        }
    }
    return NULL;
}

// Context-switch storm: yield repeatedly
void* cs_worker(void* arg) {
    (void)arg;
    while (!stop) {
        sched_yield(); // Force voluntary context switch
    }
    return NULL;
}

void usage(const char* prog) {
    fprintf(stderr,
        "Usage: %s <mode> [options]\n"
        "Modes:\n"
        "  cpu   : Generate CPU pressure\n"
        "  cs    : Generate context-switch storm\n"
        "Options:\n"
        "  --threads=N     : Number of worker threads (default: 2)\n"
        "  --duration=S    : Run for S seconds (default: 30)\n",
        prog
    );
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        usage(argv[0]);
        return 1;
    }

    const char* mode = argv[1];
    int threads = 2;
    int duration = 30;

    // Parse arguments: support --threads=28 and --threads 28
    for (int i = 2; i < argc; i++) {
        char* arg = argv[i];

        if (strncmp(arg, "--threads=", 10) == 0) {
            threads = atoi(arg + 10);
        } else if (strncmp(arg, "--duration=", 11) == 0) {
            duration = atoi(arg + 11);
        } else if (strcmp(arg, "--threads") == 0 && i + 1 < argc) {
            threads = atoi(argv[++i]);
        } else if (strcmp(arg, "--duration") == 0 && i + 1 < argc) {
            duration = atoi(argv[++i]);
        } else {
            fprintf(stderr, "Unknown argument: %s\n", arg);
            usage(argv[0]);
            return 1;
        }
    }

    if (threads <= 0) threads = 2;
    if (duration <= 0) duration = 30;

    signal(SIGINT, handle_sigint);
    signal(SIGTERM, handle_sigint);

    printf("🚀 Launching '%s' mode with %d threads for %d seconds...\n", mode, threads, duration);

    pthread_t* tids = calloc(threads, sizeof(pthread_t));
    if (!tids) {
        perror("calloc");
        return 1;
    }

    void* (*worker)(void*) = NULL;
    if (strcmp(mode, "cpu") == 0) {
        worker = cpu_worker;
    } else if (strcmp(mode, "cs") == 0) {
        worker = cs_worker;
    } else {
        fprintf(stderr, "Error: unknown mode '%s'\n", mode);
        free(tids);
        return 1;
    }

    // Launch threads
    for (int i = 0; i < threads; i++) {
        if (pthread_create(&tids[i], NULL, worker, NULL) != 0) {
            perror("pthread_create");
            free(tids);
            return 1;
        }
    }

    // Run for specified duration
    sleep(duration);
    stop = 1;

    // Wait for threads to finish
    for (int i = 0; i < threads; i++) {
        pthread_join(tids[i], NULL);
    }

    free(tids);
    printf("✅ Payload finished.\n");
    return 0;
}
