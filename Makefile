SHELL := /bin/bash

REGISTRY := denhamparry
CONTAINER_NAME := hugo-denhamparry
IMAGE_NAME := hugo

.PHONY: all
all: help

.PHONY: stop_container
stop_container: ## Stop any running containers
	docker rm -f ${CONTAINER_NAME} || true

.PHONY: git_submodules
git_submodules: ## Update submodules for Hugo
	git submodule update --remote --rebase

.PHONY: hugo_build_image
hugo_build_image: git_submodules ## Build Hugo image
	docker build -t $(REGISTRY)/$(IMAGE_NAME) .

.PHONY: hugo_serve
hugo_serve: stop_container hugo_build_image git_submodules  ## Serve slides on http://localhost:1313
	docker run --rm -p 1313:1313 \
	-v $(CURDIR):/hugo-project --name ${CONTAINER_NAME} \
	$(REGISTRY)/$(IMAGE_NAME)

.PHONY: hugo_create
hugo_create: stop_container hugo_build_image git_submodules  ## Serve slides on http://localhost:1313
	docker run --rm -p 1313:1313 \
	-v $(CURDIR):/hugo-project --name ${CONTAINER_NAME} \
	$(REGISTRY)/$(IMAGE_NAME) hugo ${POST}

.PHONY: help
help: ## parse jobs and descriptions from this Makefile
	@grep -E '^[ a-zA-Z0-9_-]+:([^=]|$$)' $(MAKEFILE_LIST) \
		| grep -Ev '^(help\b[[:space:]]*:|all: help$$)' \
		| sort \
		| awk 'BEGIN {FS = ":.*?##"}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
