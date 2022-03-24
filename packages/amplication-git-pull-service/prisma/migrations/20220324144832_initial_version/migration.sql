-- CreateIndex
CREATE INDEX "GitPullEvent_provider_repositoryOwner_repositoryName_idx" ON "GitPullEvent"("provider", "repositoryOwner", "repositoryName");
