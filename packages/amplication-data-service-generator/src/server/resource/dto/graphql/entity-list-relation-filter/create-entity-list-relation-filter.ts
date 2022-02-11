import {Entity} from "../../../../../types";
import {
    getClassDeclarationById,
    interpolate,
    NamedClassDeclaration,
    removeTSClassDeclares
} from "../../../../../util/ast";
import {readFile} from "../../../../../util/module";
import {namedTypes, builders} from "ast-types";

const templatePath = require.resolve("./entity-list-relation-filter.template.ts");

export async function createEntityListRelationFilter(
    entity: Entity,
    whereInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
    const file = await readFile(templatePath);
    const id = createEntityListRelationFilterId(entity.name);

    interpolate(file,{
        ID: id,
        WHERE_INPUT: whereInput.id,
    });

    removeTSClassDeclares(file)

    return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createEntityListRelationFilterId(entityType: string): namedTypes.Identifier {
    return builders.identifier(`${entityType}ListRelationFilter`);
}