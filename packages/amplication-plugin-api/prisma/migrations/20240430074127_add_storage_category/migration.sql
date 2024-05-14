INSERT INTO "public"."Category" ("createdAt", "id", "name", "updatedAt", "icon")
VALUES (
        NOW(),
        'clvmg36on000108ma7qsp45oz',
        'Storage',
        NOW(),
        'folder'
    )
ON CONFLICT(id)
DO NOTHING;