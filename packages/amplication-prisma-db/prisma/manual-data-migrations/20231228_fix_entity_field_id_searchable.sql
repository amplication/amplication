DO $$ 
DECLARE 
    batch_size INT := 500; -- Adjust the batch size as needed
    total_rows INT;
BEGIN
    SELECT COUNT(*) INTO total_rows FROM "public"."EntityField" WHERE "dataType" = 'Id';

    FOR i IN 0..ceil(total_rows / batch_size) - 1 LOOP
        UPDATE "public"."EntityField" 
        SET searchable = TRUE, "updatedAt" = NOW()
        WHERE ctid IN (
            SELECT ctid
            FROM "public"."EntityField"
            WHERE "dataType" = 'Id'
            AND searchable <> TRUE
            LIMIT batch_size OFFSET i * batch_size
        );

        COMMIT; -- Commit after each batch to release locks
    END LOOP;
END $$;