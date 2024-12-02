# Teslo Shop

## Description

This is a simple e-commerce application built with NestJS and PostgreSQL.

## Requirements

- Node.js LTS
- Docker
- pnpm

## Install dependencies

```bash
pnpm install
```

## Database

The database is hosted in a Docker container.

To start the database, run:

```bash
docker compose up -d
```

To stop the database, run:

```bash
docker compose down
```

To check the status of the database, run:

```bash
docker compose ps
```

To check the logs of the database, run:

```bash
docker compose logs -f db
```

## Environment variables

The environment variables are loaded from the `.env` file.

To create the `.env` file, copy the `.env.template` file and set the variables.

```bash
cp .env.template .env
```

## Start the application

To start the application, run:

```bash
pnpm run start:dev
```

## Seed the database

To seed the database, run:

```bash
http://localhost:3000/api/seed
```
