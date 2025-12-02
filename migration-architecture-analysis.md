# Migration Architecture Analysis (Current State)

## 1. Repository Overview for Migration Readiness
- **Monorepo & Tooling**: Amplication is an Nx-managed TypeScript monorepo with deployable apps under `packages/`, shared libs under `libs/`, and enterprise services under `ee/`. Tooling is Node.js/NPM based with repo-level scripts (see [`package.json`](./package.json)).
- **Primary Stack**: The platform combines NestJS, GraphQL, Prisma, Kafka microservices, PostgreSQL, Redis, React/Apollo, and custom `@amplication/*` libraries (e.g., [`packages/amplication-server`](./packages/amplication-server), [`packages/amplication-client`](./packages/amplication-client)).
- **Topology**: `packages/` houses deployable services (server, client, build manager, notification-service, storage gateway, plugin APIs, GPT gateway, CLI, etc.); `libs/` contains shared util/logging/tracing/Kafka/schema-registry/ui packages; `ee/` encapsulates enterprise-only services such as `git-sync-manager`.

## 2. Current Architecture & Deployment Context
- **Platform Core**: `amplication-server` exposes GraphQL, authentication, workspace/project/resource logic, billing enforcement (Stigg), git-provider orchestration, and embeds AWS Marketplace licensing endpoints (see `src/core/*`).
- **Code Generation Pipeline**: Build requests flow server ➜ Kafka ➜ `amplication-build-manager` ➜ DSG containers ➜ artifact publication. The build manager stores transient state in Redis and spins DSG jobs through container runners (see `packages/amplication-build-manager`).
- **Artifact Handling**: `amplication-storage-gateway` enforces JWT-based access to generated builds stored under `.amplication/storage` or the configured disk backend (`packages/amplication-storage-gateway`).
- **Plugin & Catalog Ecosystem**: `amplication-plugin-api`, `data-service-generator-catalog`, and `data-service-generator-catalog-admin` manage plugin metadata, UI, and ingestion automation via Kafka, npm, and AWS ECR pullers.
- **AI & Assistance**: `gpt-gateway` and `gpt-gateway-admin` proxy OpenAI via templated conversations; the main server’s `assistant` module consumes the gateway for inline AI flows.
- **Notifications**: `notification-service` consumes Kafka topics and delegates delivery to Novu (see Section 4). The React client embeds `@novu/notification-center` for in-app notification rendering.
- **AWS Marketplace Integration**: `packages/amplication-server/src/core/aws-marketplace` defines `AwsMarketplaceModule`, controller, and service. It exposes `/integration/marketplace` and `/integration/marketplace/callback` to resolve AWS Marketplace purchases, signs users up via `AuthService.signupWithBusinessEmail`, and persists entitlements in Prisma (`awsMarketplaceIntegration` table). The service uses `@aws-sdk/client-marketplace-metering` to resolve customers and `@aws-sdk/client-marketplace-entitlement-service` to fetch entitlements, with credentials supplied through `Env.AWS_MARKETPLACE_INTEGRATION_*` variables.
- **Enterprise Extensions**: `ee/packages/git-sync-manager` manages automated pull requests, while other EE modules extend git/billing functionality via Kafka topics shared with OSS packages.

### Deployment Architecture (Current State)
- **Runtime Decomposition**:
  | Service | Container / Process Model | Notes |
  | --- | --- | --- |
  | `amplication-server` | Stateless NestJS API container; multiple replicas behind load balancing. | Connects to PostgreSQL + Kafka + Redis via env-driven configs (`packages/amplication-server/src/env.ts`).
  | `amplication-client` | React SPA served via Node/Next container or CDN. | Uses Apollo client, Stigg SDK, Novu notification center (`WorkspaceHeader.tsx`).
  | `amplication-build-manager` | Worker container consuming Kafka topics and launching DSG jobs. | Stores job metadata in Redis and instructs DSG container runners (`packages/amplication-build-manager`).
  | `notification-service` | NestJS microservice listening on Kafka topics. | Delegates delivery to Novu via `NovuService` and logs via `AmplicationLogger`.
  | `amplication-storage-gateway` | Node service exposing secured artifact download endpoints. | Requires shared filesystem or mounted volume for generated builds.
  | `amplication-plugin-api` / catalog services | Independent NestJS/Next services surfaced as microservices. | Provide plugin discovery to client/UI.
  | `gpt-gateway` & admin UI | Node services proxying OpenAI credentials. | Enforced through central `@amplication/util` logging/tracing libs.
  | `ee/git-sync-manager` | Kafka consumer worker. | Enterprise-only service that automates git operations per tenant.
  | `local-data-service-generator-controller` (dev parity) | On-demand controller that mirrors production DSG orchestration but runs locally (`packages/local-data-service-generator-controller/README.md`). | Uses Docker to spin DSG job containers on each `/api/code-generate` request.

- **Deployment Patterns & Tooling**:
  - Nx targets (`npx nx serve|build <service>`) wrap each service in its own Docker image; CI publishes these images for the managed Amplication Cloud offering (see root [`README.md`](./README.md) "Running Amplication").
  - Local contributors run `npm run docker:dev`, which executes [`docker-compose.dev.yml`](./docker-compose.dev.yml) to provision PostgreSQL 12, Redis, Kafka, ZooKeeper, and Kafka-UI. Application services run via Nx `serve` commands, matching production container entrypoints.
  - Production DSG workloads are launched by Argo Workflows; the local DSG controller explicitly notes it “mimics the production workflow, but instead of using Argo…” (README excerpt), confirming container-per-build orchestration in prod.

- **Infrastructure Provisioning**:
  - **Local Dev**: `docker-compose.dev.yml` exposes db/redis/kafka ports (`5432`, `6379`, `9092`) and persistent Docker volumes for Postgres/Redis.
  - **Production**: Connections are injected via env vars (`POSTGRESQL_URL`, `KAFKA_BROKERS`, `REDIS_*`, `HOST`, etc. in `packages/amplication-server/src/env.ts`). Managed offerings (e.g., RDS/PostgreSQL-compatible, MSK/Confluent Kafka, Elasticache Redis) are expected; no in-repo manifests provision them.
  - Kafka topics route events between services; Redis centralizes build states; PostgreSQL backs server, catalog, and AWS Marketplace tables. These infra layers are external to app containers in both environments, but dev composes them locally while prod points to pre-provisioned clusters.

- **Scaling Boundaries**:
  - `amplication-server` is horizontally scalable but bounded by Postgres and Kafka throughput; shared libs enable centralized tracing/logging to monitor saturation.
  - `amplication-build-manager` concurrency is limited by Redis throughput and host capacity for spawning DSG containers; each job becomes a separate container, so the cluster must budget CPU/memory per build.
  - `notification-service` and `git-sync-manager` scale via Kafka consumer groups; adding instances increases partition consumption but requires careful topic partitioning.
  - Storage gateway and artifact volumes remain stateful; scaling requires shared storage (NFS/S3-backed CSI) or replication of `.amplication/storage`.

## 3. Modules & Bounded Contexts
| Area | Location | Responsibility (Current State) |
| --- | --- | --- |
| Platform UI | `packages/amplication-client` | React/Apollo SPA for designing services, managing workspaces, triggering builds, embedding billing (Stigg) and Novu notification center (`WorkspaceHeader.tsx`). |
| Core API | `packages/amplication-server` | NestJS GraphQL API handling auth, workspace/project/resource/entity/build/git/billing/AWS Marketplace modules; integrates PostgreSQL via Prisma, Kafka via `createNestjsKafkaConfig`, and SendGrid/Segment hooks. |
| AWS Marketplace Licensing | `packages/amplication-server/src/core/aws-marketplace` | Handles marketplace POST flows, resolves purchasers through AWS Metering/Entitlement SDKs, registers enterprise tenants, and stores entitlements in Prisma. |
| Build Orchestration | `packages/amplication-build-manager` | Manages build queues, state in Redis, DSG container lifecycle, Kafka status events. |
| Code Generation Engines | `packages/data-service-generator`, `packages/generator-blueprints` | Generate service code per resource definition and plugin installations; support plugin templating/debugging. |
| Plugin Catalog Services | `packages/amplication-plugin-api`, `packages/data-service-generator-catalog`, `packages/data-service-generator-catalog-admin` | Maintain plugin metadata, admin UI, ingestion workers. |
| Storage Gateway | `packages/amplication-storage-gateway` | Secures artifact downloads through JWT + Kafka-based authorization. |
| Notification Engine | `packages/notification-service` | Kafka-driven Nest microservice orchestrating Novu notification packages. |
| AI Gateway & Admin | `packages/gpt-gateway`, `packages/gpt-gateway-admin` | Provide templated access to OpenAI plus admin tooling. |
| CLI | `packages/amplication-cli` | oclif-based CLI interacting with Amplication APIs. |
| Database Schema | `packages/amplication-prisma-db` | Central Prisma schema consumed by server/Prisma clients. |
| Local DSG Controller | `packages/local-data-service-generator-controller` | Dev-only service mirroring production DSG workflows using local Docker containers. |
| Enterprise Git Automation | `ee/packages/git-sync-manager` | Kafka-connected git synchronization microservice for enterprise tenants. |
| Shared Libraries | `libs/schema-registry`, `libs/util/*`, `libs/ui/design-system` | Provide event schemas, logging/tracing/nest utilities, git helpers, and React design system primitives used across services. |

## 4. External Dependencies in Use Today
| Dependency | Purpose / Usage | Current-State Notes |
| --- | --- | --- |
| PostgreSQL | Primary relational datastore for server modules, catalog, AWS Marketplace entitlements, etc. | Local dev uses the `db` service in `docker-compose.dev.yml`; production relies on env-provided URLs (`POSTGRESQL_URL`). |
| Redis | Build status cache + queue metadata for build manager. | Local `redis` container in docker compose; production connection strings configured via env (`REDIS_HOST`, etc.). |
| Apache Kafka + ZooKeeper | Event bus for build orchestration, notifications, git sync, storage gateway, GPT gateway, etc. | Local compose spins `kafka`/`zookeeper`; production expects external brokers defined by `KAFKA_BROKERS`. |
| SendGrid | Outbound email delivery. | Configured in `packages/amplication-server/src/app.module.ts`; credentials stored in env/secret manager. |
| Segment | Product analytics instrumentation from server and client. | Implemented under `packages/amplication-server/src/services/segmentAnalytics` and `packages/amplication-client/public/index.html`. |
| Git Providers (GitHub, GitLab, Bitbucket, Azure DevOps, AWS CodeCommit) | Repository provisioning and sync. | Implemented in `packages/amplication-server/src/core/git/git.provider.service.ts` using respective SDKs.
| Stigg | Billing/entitlement enforcement. | Server envs expose `STIGG_*`; client loads `@stigg/react-sdk` contexts. |
| OpenAI | AI assistant flows via GPT Gateway + assistant module. | Configured in `packages/gpt-gateway` and `packages/amplication-server/src/core/assistant`. |
| **Novu Notification Platform** | External notification delivery (email/in-app/SMS) used by `notification-service` through `@novu/node` (`packages/notification-service/src/util/novuService.ts`). The client embeds `NovuProvider`/`PopoverNotificationCenter` (`packages/amplication-client/src/Workspaces/WorkspaceHeader/WorkspaceHeader.tsx`) using `REACT_APP_NOVU_IDENTIFIER`. | Credentials: `NOVU_API_KEY` (`packages/notification-service/src/env.ts`) drives backend API calls; the client uses `NX_REACT_APP_NOVU_IDENTIFIER` for the Novu app ID. Rate limiting is governed by Novu’s SaaS quotas per API key—the code does not implement local throttling or retries, so transient failures rely on Novu’s responses and logging through `AmplicationLogger`. Reliability considerations: the notification service wraps every Novu call in try/catch with structured logging but no fallback channel, meaning Novu availability is critical for notifications; subscriber/topic mutations also depend on Novu uptime. |
| **AWS Marketplace (Metering + Entitlement APIs)** | Enterprise tenant licensing & billing validation. | `AwsMarketplaceService` initializes `MarketplaceMeteringClient` and `MarketplaceEntitlementServiceClient` with creds from `Env.AWS_MARKETPLACE_INTEGRATION_*`, resolves customers via `ResolveCustomerCommand`, validates entitlements via `GetEntitlementsCommand`, and ties accounts to Amplication workspaces using Prisma + AuthService. |
| Auth0 / OIDC + Passport | User authentication (OIDC middleware + GitHub OAuth). | Implemented under `packages/amplication-server/src/core/auth`. |
| AWS SDK (ECR, CodeCommit), GitLab (`@gitbeaker/rest`), Azure DevOps API | Provider-specific sync and plugin ingestion. | Declared in `package.json` and used inside git/catalog services. |

## 5. Cross-Cutting Concerns (Implemented State)
- **Authentication & Authorization**: Centralized in `packages/amplication-server/src/core/auth` (Express OIDC, Passport strategies, workspace/project/resource roles). Tokens secure downstream services such as storage gateway.
- **Logging & Observability**: Shared libraries `@amplication/util/nestjs/logging` and `@amplication/util/nestjs/tracing` instrument every Nest service, initializing OpenTelemetry spans during bootstrap (see `packages/amplication-server/src/main.ts`).
- **Messaging & Eventing**: Kafka clients configured through `@amplication/util/nestjs/kafka`; schemas enforced via `libs/schema-registry` so producers/consumers share contracts.
- **Caching & Artifact State**: Redis coordinates build state, while generated artifacts live on shared disks managed by storage gateway and git-sync manager.
- **Analytics & Usage Tracking**: Segment is wired in both server and client; notification clicks and workspace events are tracked via `AnalyticsEventNames` in the client.

## 6. Complexity Indicators, Risks, and Migration Blockers
1. **Multi-Service Build Chain**: Migrating the build pipeline requires Kafka topic parity, Redis-backed orchestration, DSG container infrastructure (Argo in prod), and artifact storage alignment, increasing migration blast radius.
2. **Heavy Custom Libraries**: Core cross-cutting behavior is encapsulated in bespoke `@amplication/*` libs; re-hosting services demands porting these utilities or rewriting logging/tracing/Kafka helpers.
3. **External Integration Footprint**: Critical flows depend on Novu, AWS Marketplace SDKs, Stigg, Segment, SendGrid, OpenAI, and multiple git providers. Each brings credential management, vendor rate limits (e.g., Novu per API key), and API compatibility challenges for any target environment.
4. **Enterprise Surface Area**: The `ee/` directory adds git automation and other proprietary services tightly integrated via Kafka topics; migrations that ignore EE packages may break enterprise tenant expectations.
5. **Stateful Infrastructure Dependencies**: Production assumes externally managed PostgreSQL, Redis, and Kafka clusters configured via env vars, while local dev spins them via Docker Compose. Any migration must supply equivalent services or adapters; otherwise, builds, notifications, and AWS Marketplace flows will fail.

---
This document captures the verified current-state architecture, dependencies, and deployment characteristics of the Amplication repository to inform migration planning.
