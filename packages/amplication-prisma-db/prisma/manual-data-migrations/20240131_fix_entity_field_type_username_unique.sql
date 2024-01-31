DO $$
DECLARE batch_size INT := 500; -- Adjust the batch size as needed
total_rows INT;
BEGIN
SELECT COUNT(*) INTO total_rows
FROM "public"."EntityField"
WHERE "dataType" = 'Username';
FOR i IN 0..ceil(total_rows / batch_size) - 1 LOOP
UPDATE "public"."EntityField"
SET "unique" = TRUE,
	"updatedAt" = NOW()
WHERE ctid IN(
		SELECT ctid
		FROM "EntityField"
		WHERE id IN(
				SELECT ef.id
				FROM "EntityField" AS ef
					JOIN "EntityVersion" AS ev ON ef."entityVersionId" = ev.id
					AND ev."versionNumber" = 0
					AND ef."dataType" = 'Username'
					JOIN "Entity" AS e ON ev."entityId" = e.id
					AND e."deletedAt" IS NULL
					JOIN "Resource" AS r ON e."resourceId" = r.id
					AND r."deletedAt" IS NULL
					AND r.archived = FALSE
					JOIN "Project" AS p ON r."projectId" = p.id
					AND p."deletedAt" IS NULL
			)
		LIMIT batch_size OFFSET i * batch_size
	);
COMMIT;
-- Commit after each batch to release locks
END LOOP;
END $$;