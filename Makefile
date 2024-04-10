build:
	docker compose build
up:
	docker compose up
down:
	docker compose down
exec:
	docker compose exec api-solid-ts bash
install:
	docker compose run api-solid-ts npm i $(package)
install-dev:
	docker compose run api-solid-ts npm i -D $(package)
migrate:
	docker compose run api-solid-ts npx prisma migrate dev
test:
	docker compose run api-solid-ts npm run test
test-watch:
	docker compose run api-solid-ts npm run test:watch
test-e2e:
	docker compose run api-solid-ts npm run test:e2e
test-e2e-watch:
	docker compose run api-solid-ts npm run test:e2e:watch