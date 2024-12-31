-- CreateTable
CREATE TABLE "TeamAssignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToTeamAssignment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamAssignment.teamId_resourceId_unique" ON "TeamAssignment"("teamId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToTeamAssignment_AB_unique" ON "_RoleToTeamAssignment"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToTeamAssignment_B_index" ON "_RoleToTeamAssignment"("B");

-- AddForeignKey
ALTER TABLE "TeamAssignment" ADD CONSTRAINT "TeamAssignment_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAssignment" ADD CONSTRAINT "TeamAssignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToTeamAssignment" ADD CONSTRAINT "_RoleToTeamAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToTeamAssignment" ADD CONSTRAINT "_RoleToTeamAssignment_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
