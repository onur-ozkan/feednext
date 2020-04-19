dev:
	docker-compose up
prod:
	docker-compose up -d node_server
down:
	docker-compose down