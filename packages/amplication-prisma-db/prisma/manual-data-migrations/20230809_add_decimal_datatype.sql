-- SELECT ef."name", ef."dataType", ef.properties
-- FROM "EntityField" as ef
-- WHERE ef."dataType" = 'DecimalNumber'
-- AND NOT (ef.properties)::jsonb ? 'databaseFieldType';

UPDATE "EntityField"
SET properties = properties || '{ "databaseFieldType": "FLOAT" }'
WHERE "dataType" = 'DecimalNumber'
AND NOT (properties)::jsonb ? 'databaseFieldType';