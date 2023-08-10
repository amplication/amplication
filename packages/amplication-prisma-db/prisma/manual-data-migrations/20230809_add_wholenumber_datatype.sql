-- SELECT ef."name", ef."dataType", ef.properties
-- FROM "EntityField" as ef
-- WHERE ef."dataType" = 'WholeNumber'
-- AND NOT (ef.properties)::jsonb ? 'dataType';

UPDATE "EntityField"
SET properties = properties || '{ "databaseFieldType": "INT" }'
WHERE "dataType" = 'WholeNumber'
AND NOT (properties)::jsonb ? 'dataType';

