# Nest.js Starter

## Start Guide

### Without Docker

- Create .env file `cp .env.example .env` and replace existing env variables
  (mysql/mariadb connection params)
- Install dependencies `yarn`
- Start the app `yarn start` (app will be exposed through the port 3000)

### Using Docker

```bash
cp .env.example .env
docker-compose up -d
docker exec -it nest yarn migration:run
```

## Migrations

If you don't work on a production-ready project you can always change `DB_SYNC` env variable to true so you can play with NestJS without the need to write actual migrations.

**`synchronize: true` shouldn't be used in production - otherwise, you can lose production data.**

### Create Migration

```bash
$ docker exec -it nest yarn migration:create -n {CreateTableUsers}
```
Migration file will be placed under `src/migrations`. For more details check the existing [1611484925515-CreateUsersTable.ts](src/migrations/1611484925515-CreateUsersTable.ts)

### Run Migrations
```bash
$ docker exec -it nest yarn migration:run
```
### Revert Migrations
```bash
$ docker exec -it nest yarn migration:revert
```

## Test

```bash
# unit tests
$ docker exec -it nest yarn test

# e2e tests
$ docker exec -it nest yarn test:e2e

# test coverage
$ docker exec -it nest yarn test:cov
```

## Environment Configuration

Integrated Configuration Module so you can just inject `ConfigService`
and read all environment variables from `.env` file, which is created automatically by the init script from `.env.example`.

## Swagger

RESTful APIs you can describe with already integrated Swagger.
To see all available endpoints visit `BASE_URL/api/docs`.

## Authentication - JWT

Already preconfigured JWT authentication.
It would be greater to change current password hashing to something more secure.
