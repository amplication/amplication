

INSERT INTO "public"."Generator" (
        "createdAt",
        "fullName",
        "id",
        "isActive",
        "name",
        "updatedAt"
    )
VALUES (
        NOW(),
        'generator-blueprints',
        'cm389aka6000122lp3w5j07bj',
        't',
        'Blueprint',
        NOW()
    )
    ON CONFLICT(id) DO NOTHING;


