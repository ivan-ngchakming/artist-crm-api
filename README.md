# Artist CRM API

Back-end for https://github.com/ivan-ngchakming/artist-crm-web

## Setup Development Environment

### Docker

Spin up development environment

```bash
docker compose up dev
```

### Environment Variables

Create `.env` file at root directory.

```bash
PORT=8000

# Database
DB_PORT=5432
DB_HOST=postgres
DB_DATABASE_NAME=artist-crm
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Database Migration

Generate migration files

```bash
yarn typeorm migration:generate -n <name of migration file>
```

Run migration

```bash
yarn typeorm migration:run
```
