# Nest.js Starter

## Start Guide

### Without Docker

- Create dotenv file by running `cp .env.example .env` and configure it with proper values
- Install dependencies by running `yarn`
- Start the app `yarn start:dev` (it will serve at port 3000)

### Using Docker

```bash
cp .env.example .env
docker-compose up -d
```

## Migrations

If you don't work on a production-ready project you can always change `DB_SYNC` env variable to true so you can play with NestJS without the need to write actual migrations.

**`synchronize: true` shouldn't be used in production - otherwise, you can lose production data.**

### Create Migration

```bash
docker exec -it nest yarn migration:create -n AddAgeColumnToUserModel
```

Migration files are placed under `src/migrations`.

### Run Migrations

```bash
docker exec -it nest yarn migration:run
```

### Revert Migrations

```bash
docker exec -it nest yarn migration:revert
```

## Test

```bash
# unit tests
docker exec -it nest yarn test

# e2e tests
docker exec -it nest yarn test:e2e

# test coverage
docker exec -it nest yarn test:cov
```

## Environment Configuration

Integrated Configuration Module so you can just inject `ConfigService`
and read all environment variables from dotenv file.

## Swagger

Swagger is setup already, you can check it by browsing `BASE_URL/api/docs`.

## Authentication - JWT

Already preconfigured JWT authentication.  
It would be greater to change current password hashing to something more secure.
