BEGIN;

SELECT COUNT(*)
FROM "public"."EntityField" 
WHERE  "EntityField"."dataType" = 'Id'
AND "EntityField".searchable = 't' ;

UPDATE "public"."EntityField" SET searchable = 't', "updatedAt" = NOW()
    WHERE "dataType" = 'Id';

SAVEPOINT my_savepoint;

SELECT COUNT(*)
FROM "public"."EntityField" 
WHERE  "EntityField"."dataType" = 'Id'AND "EntityField".searchable <> 't' ;

-- ROLLBACK TO my_savepoint;

-- COMMIT;