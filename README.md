# DS Back

Backend for the purchase suggestion management system, built with **NestJS**, **Prisma**, and **PostgreSQL**.

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [npm](https://www.npmjs.com/)

---

## Why Docker?

We use Docker to run the PostgreSQL database in an isolated and consistent environment. This eliminates differences between developer machines (if it works on yours, it works on everyone's) and avoids installing PostgreSQL directly on your operating system.

---

## Initial Setup

### 1. Install dependencies

```bash
cd ds-back
npm install
```

### 2. Configure environment variables

Create your `.env` file at the root of the project with the following content:

```env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

NODE_ENV=

JWT_SECRET=your-secret-key-here
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
```

### 3. Start the database with Docker

```bash
docker-compose up -d
```

This starts a PostgreSQL container on port `5432`. The `-d` flag runs it in the background.

To stop it:

```bash
docker-compose down
```

### 4. Run database migrations

Migrations create the tables in the database based on the Prisma schema:

```bash
npx prisma migrate dev --name "init"
```

> Use this command in **development only**. In production, use `npx prisma migrate deploy`.

### 5. Seed the database

Seeds insert the initial data required for the application to work correctly (roles, users, statuses, etc.):

```bash
npm run seed

> The script will ask for confirmation before running. Type `y` to proceed.
```

**Note:** Every time you run the seed script, the corresponding tables are truncated (emptied) and all items are recreated from scratch. This is intended for development and testing only.


### 6. Run the project

```bash
# Development mode (auto-reloads on file change)
npm run start:dev

# Production mode
npm run start:prod
```

- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api`

---

## Database Workflow

### Development

Whenever you make changes to `prisma/schema/*.prisma` files:

1. Generate and apply the migration:
   ```bash
   npx prisma migrate dev --name "describe-your-change"
   ```
2. Commit the generated migration files along with your code changes.

### Production

Never run `migrate dev` in production. Use instead:

```bash
npx prisma migrate deploy
```

This applies only pending migrations without generating new ones or modifying the schema.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start the server in development mode with auto-reload |
| `npm run start:prod` | Start the compiled server for production |
| `npm run build` | Compile the TypeScript project |
| `npm run seed` | Run the database seeds |
---

## Best Practices

- **Generate migrations in development** and apply them in production with `migrate deploy`.
- **Run seeds only in development** or testing environments — never against production data.
- **Document all endpoints** using the `@ApiSuccessResponse` and `@ApiErrorResponse` decorators.
- **Swagger examples** belong in `src/modules/<module>/docs/<module>.docs.ts`, not inline in the controller.
- **Follow the established folder structure**: `controller`, `service`, `dto/`, `docs/` — only create `entities/` if needed for domain logic beyond Prisma.