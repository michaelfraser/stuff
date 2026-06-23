SHELL=/bin/bash
VERSION := $(shell git rev-parse --short HEAD)

help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

update-version: ## Update version.json with the current git hash
	@echo "Updating version.json with git hash $(VERSION)"
	@echo "{\"version\":\"$(VERSION)\"}" > dist/version.json
	@echo "{\"version\":\"$(VERSION)\"}" > public/version.json

