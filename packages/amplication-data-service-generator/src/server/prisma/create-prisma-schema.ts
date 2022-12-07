import {
  CreatePrismaSchemaParams,
  Entity,
  EntityField,
  EventNames,
  Module,
  types,
} from "@amplication/code-gen-types";
import { countBy } from "lodash";
import * as PrismaSchemaDSL from "prisma-schema-dsl";
import * as PrismaSchemaDSLTypes from "prisma-schema-dsl-types";

import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { getEnumFields } from "../../util/entity";
import {
  createEnumName,
  createPrismaSchemaFieldsHandlers,
} from "./create-prisma-schema-fields";

export async function createPrismaSchema(
  eventParams: CreatePrismaSchemaParams
): Promise<Module[]> {
  return await pluginWrapper(
    createPrismaSchemaInternal,
    EventNames.CreatePrismaSchema,
    eventParams
  );
}

export async function createPrismaSchemaInternal({
  entities,
  dataSource,
  clientGenerator,
}: CreatePrismaSchemaParams): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const MODULE_PATH = `${serverDirectories.baseDirectory}/prisma/schema.prisma`;
  const fieldNamesCount = countBy(
    entities.flatMap((entity) => entity.fields),
    "name"
  );
  const models = entities.map((entity) =>
    createPrismaModel(entity, fieldNamesCount)
  );

  const enums = entities.flatMap((entity) => {
    const enumFields = getEnumFields(entity);
    return enumFields.map((field) => createPrismaEnum(field, entity));
  });

  const prismaDataSource = {
    name: dataSource.name,
    provider: dataSource.provider,
    url: dataSource.url,
  };

  const prismaClientGenerator = PrismaSchemaDSL.createGenerator(
    clientGenerator.name,
    clientGenerator.provider
  );

  const schema = PrismaSchemaDSL.createSchema(models, enums, prismaDataSource, [
    prismaClientGenerator,
  ]);

  return [
    {
      path: MODULE_PATH,
      code: await PrismaSchemaDSL.print(schema),
    },
  ];
}

export function createPrismaEnum(
  field: EntityField,
  entity: Entity
): PrismaSchemaDSLTypes.Enum {
  const { options } = field.properties as types.OptionSet;
  return PrismaSchemaDSL.createEnum(
    createEnumName(field, entity),
    options.map((option) => option.value)
  );
}

export function createPrismaModel(
  entity: Entity,
  fieldNamesCount: Record<string, number>
): PrismaSchemaDSLTypes.Model {
  return PrismaSchemaDSL.createModel(
    entity.name,
    entity.fields.flatMap((field) =>
      createPrismaSchemaFieldsHandlers[field.dataType](
        field,
        entity,
        fieldNamesCount
      )
    )
  );
}
