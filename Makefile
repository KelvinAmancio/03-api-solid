build:
	docker compose build
up:
	docker compose up
down:
	docker compose down
exec:
	docker compose exec api-solid-ts bash
migrate:
	docker compose run api-solid-ts npx prisma migrate dev
test:
	docker compose run api-solid-ts npm run test
test-watch:
	docker compose run api-solid-ts npm run test:watch