# Carma-Tech API, built based on [nest-starter](https://github.com/crazyoptimist/nest-starter)

## How to start

### Without Docker

- Create dotenv file by running `cp .env.example .env` and configure it with proper values
- Install dependencies by running `yarn install`
- Run it in dev mode by `yarn start:dev` (it will serve at port 3000)
- Or you can use webpack hot module reload `yarn start`

### Using Docker

```bash
cp .env.example .env
docker-compose up -d
```

## Migrations

If you don't work on a production-ready project you can always change `DB_SYNC` env variable to true so you can play with NestJS without the need to write actual migrations.

**`synchronize: true` shouldn't be used in production - otherwise, you can lose production data.**

### Generate a Migration

```bash
npm run migration:generate --name=AddAgeColumnToUser
```

or with docker:

```bash
docker exec -it nest npm run migration:generate --name=AddAgeColumnToUser
```

Migration files are placed under `src/migrations`.

### Run Pending Migrations

```bash
docker exec -it nest yarn migration:run
```

### Revert a Migration

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

## CRUD Commands for LocalStack

### Create Table

```bash
aws dynamodb --endpoint-url=http://localhost:4566 create-table \
    --table-name Users \
    --attribute-definitions \
        AttributeName=Name,AttributeType=S \
        AttributeName=Password,AttributeType=S \
    --key-schema \
        AttributeName=Name,KeyType=HASH \
        AttributeName=Password,KeyType=RANGE \
--provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5
```
### Checkout Table Status

```bash
aws --endpoint-url=http://localhost:4566 dynamodb describe-table --table-name Users | grep TableStatus
```

