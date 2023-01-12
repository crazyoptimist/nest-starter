# Carma-Tech API, built based on [nest-starter](https://github.com/crazyoptimist/nest-starter)

[![build & test](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml/badge.svg)](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml)

Build a modular REST API with NestJS framework.

## Table of Contents

- [What is this?](#what-is-this)
- [Run(Dev Mode)](#rundev-mode)
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
- [DB Migrations](#db-migrations)
  - [Generate a Migration](#generate-a-migration)
  - [Run Pending Migrations](#run-pending-migrations)
  - [Revert a Migration](#revert-a-migration)
- [Tests](#tests)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [License](#license)
- [Maintainers](#maintainers)

## What is this?

A REST API template based on NestJS with JWT auth, Open API 3.0 documentation, TypeORM integration already implemented.

## Run(Dev Mode)

### With Docker

```bash
cp .env.example .env
docker-compose up -d
```

### Without Docker

Create dotenv file and fill it with proper values

```bash
cp .env.example .env
```

Install dependencies

```bash
yarn install
```

Run the application

```bash
yarn start:dev
```

HMR(Hot Module Reload) is configured with webpack, so you can use

```bash
yarn start
```

## DB Migrations

If you don't work on a production-ready project you can always change `DB_SYNC` env variable to true so you can play with NestJS without the need to write actual migrations.

**`DB_SYNC` should not be set to `true` in production. You may lose production data otherwise!**

### Generate a Migration

Make sure to use `npm` for commands follow, because `yarn` does not support `$npm_config_name`.

```bash
npm run migration:generate --name=AddAgeColumnToUser
```

Or with docker:

```bash
docker exec -it nest npm run migration:generate --name=AddAgeColumnToUser
```

Migration files are placed under `src/migrations`.

### Run Pending Migrations

```bash
yarn migration:run
```

### Revert a Migration

```bash
yarn migration:revert
```

## Tests

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Environment Configuration

`@nestjs/config` is used, so you can just inject `ConfigService` to read environment variables from the dotenv file.

## API Documentation

OpenAPI 3.0 is configured, and the API docs is hosted at `BASE_URL/api/docs`.

## Authentication

JWT authentication is configured.

It would be greater to change the current password hashing to something more secure.

## License

MIT

## Maintainers

[crazyoptimist](https://crazyoptimist.net)


