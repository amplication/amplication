INSERT INTO "Project"("id", "workspaceId", "name") 
SELECT "id", "workspaceId", CONCAT('project-', "id") FROM "App";

UPDATE public."App"
SET "projectId" = id;
