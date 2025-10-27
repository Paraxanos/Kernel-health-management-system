CC = gcc
CFLAGS = -Wall -Wextra -std=c11
SRC = src/khms_agent.c
BIN = khms_agent

all: $(BIN)

$(BIN): $(SRC)
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(BIN)

.PHONY: all clean