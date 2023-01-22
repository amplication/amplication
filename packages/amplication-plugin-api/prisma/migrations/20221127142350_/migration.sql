-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plugin" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "github" TEXT,
    "icon" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT,
    "npm" TEXT,
    "pluginId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "website" TEXT,

    CONSTRAINT "Plugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PluginVersion" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "pluginId" TEXT,
    "settings" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" TEXT,

    CONSTRAINT "PluginVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Plugin_pluginId_key" ON "Plugin"("pluginId");
