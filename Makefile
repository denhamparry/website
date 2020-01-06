SHELL := /bin/bash

REGISTRY := denhamparry
CONTAINER_NAME := hugo-denhamparry
IMAGE_NAME := hugo

##@ Help
.PHONY: help
help: ## Show this screen (default behaviour of `make`)
	@echo "Website for denhamparry.co.uk"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

stop_container:
	docker rm -f ${CONTAINER_NAME} || true

git_submodules:
	git submodule update --init --recursive

hugo_build_image:
	docker build -t $(REGISTRY)/$(IMAGE_NAME) .

hugo_serve: stop_container hugo_build_image git_submodules  ## Serve slides on http://localhost:1313
	docker run --rm -p 1313:1313 \
	-v $(CURDIR):/hugo-project --name ${CONTAINER_NAME} \
	$(REGISTRY)/$(IMAGE_NAME)

hugo_create: stop_container hugo_build_image git_submodules  ## Serve slides on http://localhost:1313
	docker run --rm -p 1313:1313 \
	-v $(CURDIR):/hugo-project --name ${CONTAINER_NAME} \
	$(REGISTRY)/$(IMAGE_NAME) hugo ${POST}