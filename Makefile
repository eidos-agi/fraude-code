.PHONY: build test vet check run clean
build:
	go build -o bin/fraude-code .
test:
	go test ./...
vet:
	go vet ./...
check: vet test build
run: build
	./bin/fraude-code
clean:
	rm -rf bin
