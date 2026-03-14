<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

# Project Overview

This repository is used to build and study a variety of UI patterns. Each page under `src/app/` is an independent sample implementation, with shared providers living under `src/app/_providers/`.

## Project Commands

### Core Development

```bash
vp dev                  # Start the dev server
vp build                # Build the app
vp lint                 # Run Oxlint
vp fmt --check          # Check formatting with Oxfmt
vp fmt --write          # Write formatting changes
vp test run             # Run tests
vp run storybook        # Start Storybook
vp run storybook:build  # Build Storybook
vp run db:generate      # Regenerate DB schema artifacts
```

### Type Checking

```bash
next typegen && tsc --noEmit
```

## Architecture

### App Structure

- **Next.js App Router** is used for routing and layout composition.
- **Static export** is enabled, and the site is intended to be fully static.
- **Firebase Hosting** is the deployment target. `cleanUrls` is used instead of `trailingSlash`.

### Database

- **PGlite** provides an IndexedDB-backed PostgreSQL-compatible database in the browser.
- **Drizzle ORM** is used for typed database access.
- **`pgliteManager`** in `src/lib/pglite-manager.ts` owns the shared PGlite lifecycle.
- **`ensureSchema()`** in `src/lib/db/migrate.ts` handles schema version checks and reset/reseed flow when needed.

Initialization flow:

1. `PGliteProvider` mounts.
2. `pgliteManager.startInitialization()` initializes the database.
3. `ensureSchema()` checks the schema version.
4. On mismatch, the DB is reset, recreated, and seeded.
5. `pgliteManager.markSchemaReady()` marks initialization complete.

### Styling

- **Tailwind CSS v4**
- **Radix UI**
- **Motion**
- **tailwind-variants**

## Project Notes

### Schema Editing

`src/lib/db/schema.ts` re-exports the active app schema. When changing schema, edit the actual schema file first and then run:

```bash
vp run db:generate
```

### Firebase Metadata

Do not use `trailingSlash: true`. It breaks metadata file resolution on Firebase Hosting. Keep using `cleanUrls`.

## Workflow Expectations

- Before opening a PR, rebase onto the latest base branch.
- When fixing a bug, reproduce it with a failing test first when practical.
- Use `agent-browser` for browser automation tasks in this repo.
