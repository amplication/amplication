/*
  Warnings:

  - The primary key for the `GitPullEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `GitPullEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GitPullEvent" DROP CONSTRAINT "GitPullEvent_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "GitPullEvent_id_key" ON "GitPullEvent"("id");
