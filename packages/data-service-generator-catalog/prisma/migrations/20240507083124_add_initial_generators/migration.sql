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
        'data-service-generator',
        'clvw51yfj000009jyek8926n5',
        't',
        'NodeJS',
        NOW()
    )
    ON CONFLICT(id) DO NOTHING;


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
        'generator-dotnet-webapi',
        'clvw52axv000109jydfy28a8y',
        't',
        'DotNET',
        NOW()
    )
    ON CONFLICT(id) DO NOTHING;


