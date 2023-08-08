UPDATE public."BlockVersion"
SET settings = settings || '{ "authEntityName": "User" }'
WHERE "id" in (
        select id
        from public."BlockVersion"
        where "blockId" in (
                select id
                from public."Block"
                where "blockType" = 'ServiceSettings'
                    and "resourceId" in (
                        select "resourceId"
                        from public."Block"
                        where id in (
                                select "blockId"
                                from public."BlockVersion"
                                where "blockId" in (
                                        select id
                                        from public."Block"
                                        where "blockType" = 'PluginInstallation'
                                    )
                                    and ("settings"->'pluginId')::jsonb ? 'auth-core'
                            )
                    )
            )
    )