import {
  Entity,
  EnumDataType,
  EnumPrismaScalarType,
  PrismaDataSource,
} from "./types";

const dataTypeToPrismaType: {
  [dataType in EnumDataType]: EnumPrismaScalarType;
} = {
  [EnumDataType.singleLineText]: EnumPrismaScalarType.String,
  [EnumDataType.multiLineText]: EnumPrismaScalarType.String,
  [EnumDataType.email]: EnumPrismaScalarType.String,
  [EnumDataType.state]: EnumPrismaScalarType.String,
  [EnumDataType.autoNumber]: EnumPrismaScalarType.Int,
  [EnumDataType.wholeNumber]: EnumPrismaScalarType.Int,
  [EnumDataType.dateTime]: EnumPrismaScalarType.DateTime,
  [EnumDataType.decimalNumber]: EnumPrismaScalarType.Float,
  [EnumDataType.file]: EnumPrismaScalarType.String,
  [EnumDataType.image]: EnumPrismaScalarType.String,
  [EnumDataType.boolean]: EnumPrismaScalarType.Boolean,
  [EnumDataType.uniqueId]: EnumPrismaScalarType.String,
  [EnumDataType.geographicAddress]: EnumPrismaScalarType.String,
};

const HEADER = `generator client {
  provider = "prisma-client-js"
}

`;
export const ID_FIELD = `id String @default(cuid()) @id`;

export function createPrismaSchema(
  dataSource: PrismaDataSource,
  entities: Entity[]
): string {
  let text = HEADER;
  text += `datasource {
  provider = "${dataSource.provider}"
  url      = "${dataSource.url}"
}

`;
  for (const entity of entities) {
    text += `model ${entity.name} {\n\t${ID_FIELD}\n`;
    for (const field of entity.fields) {
      const scalarType = dataTypeToPrismaType[field.dataType];
      text += `\t${field.name} ${scalarType}\n`;
    }
    text += "}";
  }
  return text;
}
