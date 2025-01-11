-- CreateTable
CREATE TABLE "_RoleToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToTeam_AB_unique" ON "_RoleToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToTeam_B_index" ON "_RoleToTeam"("B");

-- AddForeignKey
ALTER TABLE "_RoleToTeam" ADD CONSTRAINT "_RoleToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToTeam" ADD CONSTRAINT "_RoleToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
