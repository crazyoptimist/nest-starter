# NestJS Starter

[![build & test](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml/badge.svg)](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml)

Build a modular REST API with NestJS framework.

## Table of Contents

- [What is this?](#what-is-this)
- [Getting started](#getting-started)
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

This is a NestJS RESTful API starter that includes JWT authentication, OpenAPI 3 documentation, and TypeORM integration.

The reason I maintain it is because using this template allows you to quickly set up a production-ready RESTful API with minimal boilerplate code.

## Getting started

Create a dotenv file and fill it out with the appropriate values.

```bash
cp .env.example .env
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

HMR(Hot Module Reload) is configured with webpack.

## DB Migrations

If you don't require incremental database migrations, set the DB_SYNC environment variable to true. This will continuously synchronize the database structure with the schema defined in the codebase.

__However, DO NOT set DB_SYNC to true in a production environment, as doing so may result in data loss!__

#### Generate a New Migration

Make sure to use npm for the following commands, as yarn does not support `$npm_config_name`.

```bash
npm run migration:generate --name=AddAgeColumnToUser
```

Or with docker:

```bash
docker exec -it nest npm run migration:generate --name=AddAgeColumnToUser
```

Migration files located placed in the `src/migrations` directory.

#### Run Pending Migrations

```bash
npm run migration:run
```

#### Revert Migrations

Revert the last migration

```bash
npm run migration:revert
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Environment Configuration

`@nestjs/config` is used, so you can just inject `ConfigService` to read environment variables from the dotenv file.

## API Documentation

OpenAPI 3.0 is configured, and the API docs is hosted at `BASE_URL/api/docs`.

## Authentication

JWT authentication has been configured.

## License

MIT

## Maintainers

[crazyoptimist](https://crazyoptimist.net)
