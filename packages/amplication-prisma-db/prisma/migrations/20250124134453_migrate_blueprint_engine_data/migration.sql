-- Step 1: Insert new Blueprints for each Workspace
INSERT INTO "Blueprint" ("id", "createdAt", "updatedAt", "name", "key", "description", "enabled", "workspaceId", "resourceType", "codeGeneratorName", "color")
SELECT
    REPLACE(uuid_generate_v4()::TEXT, '-', ''),
    NOW(),
    NOW(),
    blueprint_name,
    blueprint_key,
    NULL,
    TRUE,
    workspace_id,
    resource_type,
    code_generator_name,
	color
FROM (
    SELECT DISTINCT
        w."id" AS workspace_id,
        b."name" AS blueprint_name,
        UPPER(b."key") AS blueprint_key,
        b."resourceType"::"EnumResourceType" AS resource_type,
        b."codeGeneratorName" AS code_generator_name,
		b."color" as color
    FROM "Workspace" w
    CROSS JOIN (
        VALUES
            ('.NET Service (Amplication''s Standard)', 'dotnet_service_standard', 'Service', 'DotNET', '#6E7FF6'),
            ('Node.js Service (Amplication''s Standard)', 'nodejs_service_standard', 'Service', 'NodeJS', '#ACD371'),
            ('Message Broker (Amplication''s Standard)', 'message_broker_standard', 'MessageBroker', 'Blueprint', '#ff6e6e')
    ) AS b("name", "key", "resourceType", "codeGeneratorName", "color")
) AS blueprints;

-- Step 2: Assign Blueprints to Resources without a Blueprint
WITH blueprint_mapping AS (
    SELECT
        b."id" AS blueprint_id,
        b."workspaceId" AS workspace_id,
        b."resourceType" AS resource_type, 
        b."codeGeneratorName" AS code_generator_name
    FROM "Blueprint" b
    WHERE b."name" IN ('.NET Service (Amplication''s Standard)', 'Node.js Service (Amplication''s Standard)', 'Message Broker (Amplication''s Standard)')
),
resource_to_workspace AS (
    SELECT
        r."id" AS resource_id,
        r."codeGeneratorName" AS code_generator_name,
        p."workspaceId" AS workspace_id,
        r."resourceType" AS resource_type
    FROM "Resource" r
    JOIN "Project" p ON r."projectId" = p."id"
	WHERE r."blueprintId" IS NULL
		AND r."resourceType" IN ('Service', 'MessageBroker')
)

UPDATE "Resource"
SET "blueprintId" = subquery.blueprint_id
FROM (
    SELECT rw.resource_id, bm.blueprint_id
    FROM resource_to_workspace rw
    JOIN blueprint_mapping bm
    ON rw.workspace_id = bm.workspace_id
    AND rw.resource_type = bm.resource_type 
	AND (rw.code_generator_name = bm.code_generator_name 
		OR (rw.resource_type = 'Service' AND bm.code_generator_name = 'NodeJS')
		OR (rw.resource_type = 'MessageBroker' AND bm.code_generator_name = 'Blueprint')
		)
) AS subquery
WHERE "Resource"."id" = subquery.resource_id
  AND "Resource"."blueprintId" IS NULL;
