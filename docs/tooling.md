# Tooling and Workflows

Developer-facing commands and workflows for working on the Sypur Testimonial Platform.

## UI Components

The UI is built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/).

Add new components with:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Refer to https://ui.shadcn.com/docs/components/ for the full component list.

## Convex Backend

Convex powers the real-time database, file storage, and serverless functions.

### Local Development

```bash
pnpm convex dev
```

### Deployment

```bash
pnpm convex deploy
```

## Running Isolated Scripts

Execute any TypeScript file in isolation:

```bash
pnpm run_in_isolation -- path/to/your/file.ts
```

## Build and Preview

Build the production bundle:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Linting and Formatting

We use [Biome](https://biomejs.dev/) for linting and formatting.

Check for issues:

```bash
pnpm lint
pnpm format
```

Automatically fix lint and format issues

```bash
pnpm lint --fix
pnpm format --write
```

One command fix all

```bash
pnpm check --write
```

## Convex Migrations

Consult the [Convex migrations documentation](https://www.convex.dev/components/migrations) for more detail.

Run a single migration:

```bash
pnpx convex run migrations:run '{fn: "migrations:yourMigrationName"}'
```

See `docs/project-structure.md` for an overview of the repository layout.
