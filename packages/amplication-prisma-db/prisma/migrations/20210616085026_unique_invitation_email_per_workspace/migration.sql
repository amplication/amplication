/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[workspaceId,email]` on the table `Invitation`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invitation.workspaceId_email_unique" ON "Invitation"("workspaceId", "email");
