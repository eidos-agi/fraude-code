.PHONY: build test vet check run install clean
build:
	go build -o bin/fraude-code .
test:
	go test ./...
vet:
	go vet ./...
check: vet test build
run: build
	./bin/fraude-code

# Install as both 'fraude' and 'fraude-code' on PATH (~/.local/bin).
install:
	go build -o $(HOME)/.local/bin/fraude-code .
	ln -sf $(HOME)/.local/bin/fraude-code $(HOME)/.local/bin/fraude
	@echo "installed: type 'fraude'"
clean:
	rm -rf bin
