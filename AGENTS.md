# AGENTS.md

## Project Overview
Amplication is a TypeScript-based monorepo for building and operating the Amplication platform. The repository contains multiple applications and shared libraries managed with Nx, including backend services (NestJS/Node), frontend applications (React), generators, gateways, and supporting infrastructure.

Validated from:
- `README.md`
- `CONTRIBUTING.md`
- `package.json`
- `nx.json`

## Repository Structure
Top-level structure (validated from repository root):

- `packages/` — main applications and services (for example `amplication-server`, `amplication-client`, `notification-service`, `amplication-plugin-api`)
- `libs/` — shared libraries
- `ee/` — enterprise-licensed components (`ee/LICENSE` applies)
- `docs/` — documentation assets
- `tutorials/` — tutorial content
- `.github/workflows/` — CI/CD workflows
- `scripts/` — repository scripts used by setup/build flows

Nx workspace layout (from `nx.json`):
- `appsDir`: `packages`
- `libsDir`: `libs`
- `defaultBase`: `master`

## Development Guidelines
- Use the supported toolchain versions from `package.json`:
  - Node.js: `^22.13.0`
  - npm: `^9.0.0`
- Install dependencies at repository root:
  - `npm install`
- Use Nx targets via npm scripts or direct `nx` commands.
- Prefer scoped execution (`nx <target> <project>`) when changing a specific package.
- Keep formatting and linting consistent with repository config (`Prettier`, `ESLint`, `lint-staged`, Husky).

## Code Patterns
This repository follows Nx target-based workflows across projects.

Common patterns validated in project configs:
- Per-project targets such as `build`, `serve`, `test`, `lint`
- Dependency chains in targets (for example `prebuild -> build -> postbuild` and Prisma/codegen dependencies)
- Backend app pattern (`packages/amplication-server/project.json`):
  - `build` with webpack for Node output
  - GraphQL schema/codegen helper targets
  - `serve` using Node executor
- Frontend app pattern (`packages/amplication-client/project.json`):
  - webpack build + dev-server serve
  - environment-specific build configurations
- Shared library pattern (`libs/util/code-gen-utils/project.json`):
  - TypeScript library build with `@nx/js:tsc`
  - local `lint` and `test` targets

## Quality Standards
- Run formatting checks before submitting changes:
  - `npm run format:check`
- Apply formatting when needed:
  - `npm run format:write`
- Run lint/test for affected scope or relevant projects.
- For broad CI-like testing in this workspace:
  - `npm run test:ci`
- Follow conventional commit style documented in `CONTRIBUTING.md`:
  - `<type>(<package>): <subject>`

## Critical Rules
- Do not change license boundaries between OSS (`LICENSE`) and enterprise code (`ee/LICENSE`).
- Keep changes scoped to relevant projects; avoid unrelated refactors.
- Ensure generated/build dependencies are respected (for example Prisma/codegen prerequisites encoded in Nx targets).
- Validate local commands against existing root scripts and project targets; do not introduce undocumented command flows.
- Base branch for affected calculations is `master` (from `nx.json`).

## Common Tasks
Concrete commands validated from root `package.json` and Nx project configs:

### Initial setup
```bash
npm install
npm run setup:dev
```

### Start local infrastructure
```bash
npm run docker:dev
# or detached
npm run docker:dev -- -d
```

### Apply DB migrations
```bash
npm run db:migrate:deploy
```

### Run key services
```bash
npm run serve:server
npm run serve:client
npm run serve:plugins
npm run serve:notification
npm run serve:storage
npm run serve:dsg
npm run serve:git
```

### Build, test, and format
```bash
npm run build
npm run test:ci
npm run format:check
npm run format:write
```

### Run project-scoped Nx tasks (examples)
```bash
npx nx test amplication-server
npx nx lint amplication-client
npx nx build code-gen-utils
```

## Reference Examples
Real paths in this repository:

- Backend application: `packages/amplication-server/project.json`
- Frontend application: `packages/amplication-client/project.json`
- Shared library: `libs/util/code-gen-utils/project.json`
- Workspace config: `nx.json`
- Root scripts/toolchain: `package.json`
- Contribution standards: `CONTRIBUTING.md`
- Project introduction and local development flow: `README.md`

## Additional Resources
- Product and repository overview: `README.md`
- Contribution workflow and commit conventions: `CONTRIBUTING.md`
- Community standards: `CODE_OF_CONDUCT.md`
- Official docs: https://docs.amplication.com
