import_db_dumps:
	./db.restore.sh
dev:
	docker-compose up nginx_dev redis_dev mongo_dev backend
dev2:
	docker-compose up redis_dev mongo_dev
prod:
	docker-compose up -d nginx certbot redis backend mongo
down:
	docker-compose down