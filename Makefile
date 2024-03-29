build:
	docker compose build
up:
	docker compose up
down:
	docker compose down
migrate-dev:
	docker compose npx prisma migrate dev
exec:
	docker compose exec api-solid-ts bash