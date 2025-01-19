-- This migration was created manually to migrate the data of the template version to the new block type


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Identify existing data and prepare new blocks
WITH existing_data AS (
    SELECT 
        b.id AS old_block_id,
        b."resourceId",
        b."displayName" AS old_display_name,
        b."description" AS old_description,
        b."createdAt" AS old_block_created_at,
        b."updatedAt" AS old_block_updated_at,
        b."deletedAt" AS old_block_deleted_at, -- Include deletedAt
        bv.id AS old_block_version_id,
        bv."settings" AS old_settings,
        bv."createdAt" AS old_version_created_at,
        bv."updatedAt" AS old_version_updated_at,
        bv."versionNumber" AS old_version_number,
		bv."commitId" AS old_commit_id
		
    FROM
        PUBLIC."BlockVersion" bv
        JOIN public."Block" b ON bv."blockId" = b.id
    WHERE
        b."blockType" = 'ServiceSettings'
        AND bv."settings" ? 'serviceTemplateVersion'
),
new_blocks AS (
    INSERT INTO public."Block" (
        id,
        "resourceId",
        "blockType",
        "displayName",
        "description",
        "createdAt",
        "updatedAt",
        "deletedAt" -- Add deletedAt column
    )
    SELECT 
        uuid_generate_v4() AS new_block_id, -- Generate a new unique ID for the block
        "resourceId",
        'ResourceTemplateVersion',
        'Resource Template Version',
        'Resource Template Version',
        old_block_created_at,
        old_block_updated_at,
        old_block_deleted_at -- Copy deletedAt
    FROM existing_data
    GROUP BY 
        "resourceId", old_block_created_at, old_block_updated_at, old_block_deleted_at
    RETURNING id AS new_block_id, "resourceId"
)
-- Step 2: Insert all related BlockVersion records
INSERT INTO public."BlockVersion" (
    id,
    "blockId",
    "versionNumber",
    "settings",
    "inputParameters",
    "outputParameters",
    "createdAt",
    "updatedAt",
	"commitId"
)
SELECT 
    uuid_generate_v4() AS new_block_version_id, -- Generate a new unique ID for the block version
    nb.new_block_id,
    ed.old_version_number,
    jsonb_build_object(
        'version', ed.old_settings->'serviceTemplateVersion'->>'version',
        'serviceTemplateId', ed.old_settings->'serviceTemplateVersion'->>'serviceTemplateId'
    ) AS new_settings,
    '{}'::jsonb AS new_input_params, -- Default inputParams
    '{}'::jsonb AS new_output_params, -- Default outputParams
    ed.old_version_created_at,
    ed.old_version_updated_at,
	ed.old_commit_id
FROM 
    existing_data ed
    JOIN new_blocks nb ON ed."resourceId" = nb."resourceId";
