# NestJS Starter

[![build & test](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml/badge.svg)](https://github.com/crazyoptimist/nest-starter/actions/workflows/build.yml)

Build a modular REST API with NestJS framework.

## Table of Contents

- [What Is This?](#what-is-this)
- [Getting Started](#getting-started)
- [Database Migrations](#database-migrations)
  - [Generate a New Migration](#generate-a-new-migration)
  - [Run Pending Migrations](#run-pending-migrations)
  - [Revert Migrations](#revert-migrations)
- [Tests](#tests)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [License](#license)
- [Maintainers](#maintainers)

## What Is This?

This is a NestJS RESTful API starter that includes JWT authentication, OpenAPI 3 documentation, and TypeORM integration.

The reason I maintain it is because using this template allows you to quickly set up a production-ready RESTful API with minimal boilerplate code.

## Getting Started

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

## Database Migrations

If you don't require incremental database migrations, set the DB_SYNC environment variable to true. This will continuously synchronize the database structure with the schema defined in the codebase.

__However, DO NOT set DB_SYNC to true in a production environment, as doing so may result in data loss!__

#### Generate a New Migration

Make sure to use npm for the following commands, as yarn does not support `$npm_config_name`.

```bash
npm run migration:generate --name=AddAgeColumnToUser
```

Migration files are located in the `src/migrations` directory.

#### Run Pending Migrations

```bash
npm run migration:run
```

Using Docker:

```bash
docker exec nest npm run migration:run
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

`@nestjs/config` has been used, so you can just inject `ConfigService` to read environment variables from the dotenv file.

## API Documentation

OpenAPI 3.0 has been configured, and the API documentation is hosted at `BASE_URL/api/docs`.

## Authentication

JWT authentication has been configured.

## License

MIT

## Maintainers

[crazyoptimist](https://crazyoptimist.net)
