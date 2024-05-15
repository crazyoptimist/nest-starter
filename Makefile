docker:
	docker compose -f ./deployments/compose.yaml build
up:
	docker compose -f ./deployments/compose.yaml up -d
down:
	docker compose -f ./deployments/compose.yaml down
log:
	docker compose -f ./deployments/compose.yaml logs -f

.PHONY: deployments test
