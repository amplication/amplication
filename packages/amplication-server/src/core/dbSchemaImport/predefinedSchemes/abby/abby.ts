export const abbyPredefinedSchema = `
generator client {
  provider        = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ROLE {
  ADMIN
  USER
}

enum FeatureFlagType {
  BOOLEAN
  STRING
  NUMBER
  JSON
}

// Necessary for Next auth
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String? @db.Text
  access_token             String? @db.Text
  refresh_token_expires_in Int?
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String? @db.Text
  session_state            String?
  user                     User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model User {
  id                 String               @id @default(cuid())
  name               String?
  email              String?              @unique
  emailVerified      DateTime?
  image              String?
  accounts           Account[]
  sessions           Session[]
  invites            ProjectInvite[]
  projects           ProjectUser[]
  featureFlagHistory FeatureFlagHistory[]
  CouponCodes        CouponCodes[]
  apiKeys            ApiKey[]

  // Metadata
  hasCompletedOnboarding Boolean @default(false)
  profession             String?
  technologies           Json? // gonna be an array of strings
  experienceLevelFlags   Int?
  experienceLevelTests   Int?
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Project {
  id           String          @id @default(cuid())
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  name         String
  tests        Test[]
  invites      ProjectInvite[]
  users        ProjectUser[]
  featureFlags FeatureFlag[]
  environments Environment[]

  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  stripePriceId        String?
  currentPeriodEnd     DateTime @default(dbgenerated("(CURRENT_TIMESTAMP(3) + INTERVAL 30 DAY)"))

  apiRequests ApiRequest[]
}

model ProjectUser {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  role      ROLE     @default(USER)

  @@unique([userId, projectId])
  @@index([userId])
  @@index([projectId])
}

model ProjectInvite {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  email     String
  projectId String
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  usedAt    DateTime?

  @@unique([projectId, email])
  @@index([projectId])
  @@index([userId])
}

model Test {
  id String @id @default(cuid())

  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
  options   Option[]
  events    Event[]

  @@unique([projectId, name])
  @@index([projectId])
}

model Option {
  id         String  @id @default(cuid())
  identifier String
  chance     Decimal

  testId String
  test   Test   @relation(fields: [testId], references: [id], onDelete: Cascade)

  @@unique([testId, identifier])
}

model Event {
  id String @id @default(cuid())

  test   Test   @relation(fields: [testId], references: [id], onDelete: Cascade)
  testId String

  type            Int
  selectedVariant String
  createdAt       DateTime @default(now())

  @@index([testId])
  @@index([type])
  @@index([selectedVariant])
}

model FeatureFlag {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String

  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String

  description String?            @db.Text
  values      FeatureFlagValue[]
  type        FeatureFlagType    @default(BOOLEAN)

  @@unique([projectId, name])
  @@index([projectId])
}

model FeatureFlagValue {
  id     String      @id @unique @default(cuid())
  flagId String
  flag   FeatureFlag @relation(fields: [flagId], references: [id], onDelete: Cascade)

  environmentId String
  environment   Environment @relation(fields: [environmentId], references: [id], onDelete: Cascade)

  value   String               @db.LongText
  history FeatureFlagHistory[]

  @@index([flagId])
  @@index([environmentId])
  @@map("FlagValue")
}

model Environment {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String

  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String

  sortIndex Int                @default(0)
  FlagValue FeatureFlagValue[]

  @@unique([projectId, name])
  @@index([projectId])
  @@index([projectId, name])
}

model FeatureFlagHistory {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  oldValue String? @db.LongText
  newValue String? @db.LongText

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  flagValue   FeatureFlagValue @relation(fields: [flagValueId], references: [id], onDelete: Cascade)
  flagValueId String

  @@index([flagValueId])
  @@index([userId])
}

model CouponCodes {
  id String @id @default(cuid())

  createdAt DateTime @default(now())

  code String @unique @default(cuid())

  stripePriceId String

  redeemedAt DateTime?

  redeemedBy   User?   @relation(fields: [redeemedById], references: [id], onDelete: Cascade)
  redeemedById String?

  @@index([redeemedById])
}

model ApiKey {
  id         String    @id @default(cuid())
  name       String
  hashedKey  String    @unique
  validUntil DateTime
  revokedAt  DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum ApiRequestType {
  GET_CONFIG
  GET_CONFIG_SCRIPT
  TRACK_VIEW
}

enum ApiVersion {
  V0
  V1
}

model ApiRequest {
  id           String         @id @default(cuid())
  createdAt    DateTime       @default(now())
  type         ApiRequestType
  durationInMs Int

  apiVersion ApiVersion @default(V0)

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}
`;
