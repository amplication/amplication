export const papermarkPredefinedSchema = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
    provider        = "prisma-client-js"
}

datasource db {
    provider = "postgres"
    url      = env("DATABASE_URL")
}

model Team {
    id    String @id @default(uuid())
    users User[]
}

enum UploadStatus {
    UPLOADING
    UPLOADED
}

model File {
    name              String       @id
    format            String
    size              Int
    description       String?
    createdAt         DateTime     @default(now())
    updatedAt         DateTime     @default(now()) @updatedAt
    meta              String       @default("{}")
    status            UploadStatus @default(UPLOADING)
    isDeleted         Boolean      @default(false)
    uploaderProject   Project?     @relation(fields: [uploaderProjectId], references: [id])
    uploaderProjectId String?
    assets            Asset[]
}

model Asset {
    id        String @id @default(uuid()) // not unique!
    projectId String
    file      File   @relation(fields: [name], references: [name])
    name      String
}

model User {
    id               String             @id @default(uuid())
    email            String?            @unique
    provider         String?
    image            String?
    username         String?
    createdAt        DateTime           @default(now())
    team             Team?              @relation(fields: [teamId], references: [id])
    teamId           String?
    projects         Project[]
    clientReferences ClientReferences[]
    checkout         TransactionLog[]
    products         UserProduct[]
}

// User client references in external services like stripe etc
model ClientReferences {
    id        String   @id @default(uuid())
    reference String   @default(dbgenerated())
    service   String
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id])
    userId    String
}

model Product {
    id           String           @id @default(uuid())
    name         String
    description  String?
    features     String[]
    images       String[]
    meta         Json
    createdAt    DateTime         @default(now())
    checkout     TransactionLog[]
    userProducts UserProduct[]
}

model TransactionLog {
    // Stripe event id (debug and idempotency purposes)
    id             String   @id @default(uuid())
    eventId        String
    userId         String?
    user           User?    @relation(fields: [userId], references: [id])
    productId      String?
    product        Product? @relation(fields: [productId], references: [id])
    createdAt      DateTime @default(now())
    eventData      Json?    @default(dbgenerated())
    eventType      String?  @default(dbgenerated())
    eventCreated   Int?     @default(dbgenerated())
    // paid
    status         String?  @default(dbgenerated())
    customerId     String?  @default(dbgenerated())
    customerEmail  String?  @default(dbgenerated())
    subscriptionId String?  @default(dbgenerated())
    // Used for Refund
    paymentIntent  String?  @default(dbgenerated())
}

model UserProduct {
    id             String  @id @default(uuid())
    userId         String
    user           User    @relation(fields: [userId], references: [id])
    productId      String
    product        Product @relation(fields: [productId], references: [id])
    // subscriptionId and customerId not null for subscriptions
    subscriptionId String?
    customerId     String?
    // Easier to debug
    customerEmail  String?
}

model Project {
    id                 String                 @id @default(uuid())
    createdAt          DateTime               @default(now())
    title              String
    domain             String                 @unique
    user               User?                  @relation(fields: [userId], references: [id])
    userId             String?
    build              Build[]
    isDeleted          Boolean                @default(false)
    files              File[]
    projectDomain      ProjectDomain[]
    latestBuild        LatestBuildPerProject?
    authorizationToken AuthorizationToken[]
}

enum PublishStatus {
    PENDING
    PUBLISHED
    FAILED
}

model Build {
    id                String   @id @default(uuid())
    version           Int      @default(0)
    lastTransactionId String?
    createdAt         DateTime @default(now())
    updatedAt         DateTime @default(now()) @updatedAt
    pages             String

    project   Project @relation(fields: [projectId], references: [id])
    projectId String

    breakpoints           String @default("[]")
    styles                String @default("[]")
    styleSources          String @default("[]")
    styleSourceSelections String @default("[]")
    props                 String @default("[]")
    dataSources           String @default("[]")
    resources             String @default("[]")
    instances             String @default("[]")

    deployment    String?
    publishStatus PublishStatus @default(PENDING)
}

enum AuthorizationRelation {
    viewers
    editors
    builders
    administrators
}

model AuthorizationToken {
    id        String                @id @default(uuid())
    token     String                @default(uuid())
    projectId String
    project   Project               @relation(fields: [projectId], references: [id])
    name      String                @default("")
    relation  AuthorizationRelation @default(viewers)
    createdAt DateTime              @default(now())
}

enum DomainStatus {
    INITIALIZING
    ACTIVE
    ERROR
    PENDING
}

// Domains  + last known status and last known txtRecord
// In the future we can update this table using queue, n8n or temporal workflows.
// As of now updates are done during UI interactions
model Domain {
    id                String              @id @default(uuid())
    domain            String              @unique
    createdAt         DateTime            @default(now())
    updatedAt         DateTime            @default(now()) @updatedAt
    ProjectDomain     ProjectDomain[]
    // Last known txtRecord of the domain (to check domain ownership)
    txtRecord         String?
    // create, init, pending, active, error
    status            DomainStatus        @default(INITIALIZING)
    // In case of status="error", this will contain the error message
    error             String?
    projectWithDomain ProjectWithDomain[]
}

model ProjectDomain {
    id        String   @id @default(uuid())
    projectId String
    project   Project  @relation(fields: [projectId], references: [id])
    domainId  String
    domain    Domain   @relation(fields: [domainId], references: [id])
    createdAt DateTime @default(now())
    // Generated txt record to check domain ownership
    txtRecord String   @unique @default(uuid())
    // CNAME record to point to the domain
    cname     String

    @@index([domainId])
}

model ProjectWithDomain {
    id         String                       @id @default(uuid())
    projectId  String
    domainId   String
    domain     Domain                       @relation(fields: [domainId], references: [id])
    txtRecord  String
    createdAt  DateTime
    // CNAME record to point to the domain
    cname      String
    verified   Boolean
    // To count statistics per user
    userId     String?
    // We can deploy on per domain basis, here for each project domain we have latest build
    latestBuid LatestBuildPerProjectDomain?
}

model LatestBuildPerProjectDomain {
    id                String            @id @default(uuid())
    domainId          String
    buildId           String
    projectId         String            @unique
    projectWithDomain ProjectWithDomain @relation(fields: [projectId], references: [id])
    isLatestBuild     Boolean
    publishStatus     PublishStatus
    updatedAt         DateTime
}

model LatestBuildPerProject {
    id            String        @id @default(uuid())
    buildId       String
    projectId     String        @unique
    domain        String
    project       Project       @relation(fields: [projectId], references: [id])
    isLatestBuild Boolean
    publishStatus PublishStatus
    updatedAt     DateTime
}

// Dashboard
model DashboardProject {
    id          String   @id @default(uuid())
    createdAt   DateTime @default(now())
    title       String
    domain      String
    userId      String?
    isDeleted   Boolean  @default(false)
    isPublished Boolean
}
`;
