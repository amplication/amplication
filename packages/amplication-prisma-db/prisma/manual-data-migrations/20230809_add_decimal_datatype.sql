-- SELECT ef."name", ef."dataType", ef.properties
-- FROM "EntityField" as ef
-- WHERE ef."dataType" = 'DecimalNumber'
-- AND NOT (ef.properties)::jsonb ? 'dataType';

UPDATE "EntityField"
SET properties = properties || '{ "dataType": "FLOAT" }'
WHERE "dataType" = 'DecimalNumber'
AND NOT (properties)::jsonb ? 'dataType';