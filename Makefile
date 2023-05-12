DOCKER_IMAGE=oliversturm/clean-microservices-cqrs-es-demo
DOCKER_TAG=1

build-docker:
	docker buildx build --pull --platform linux/amd64,linux/arm64 -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

push-docker:
	docker push $(DOCKER_IMAGE):$(DOCKER_TAG)
