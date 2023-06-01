import { Injectable } from "@nestjs/common";
import {
  createWriteStream,
  mkdirSync,
  readFileSync,
  writeFile,
  writeFileSync,
} from "fs";
import { getSchema, Schema, Model, Field, Func } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  prepareModelAttributes,
} from "./schema-utils";

type SchemaEntityFields = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  pluralName: string;
  description: string | null;
  customAttributes: string[];
  fields: {
    name: string;
    displayName: string;
    dataType: string | Func;
    required: boolean;
    unique: boolean;
    properties: {};
    customAttributes: string[];
  }[];
};

@Injectable()
export class SchemaImportService {
  constructor() {}

  async saveFile(
    file: Express.Multer.File,
    resourceId: string
  ): Promise<string> {
    const rootDir = process.cwd();
    mkdirSync(`${rootDir}/.schema-uploads/${resourceId}`, { recursive: true });
    const writeDir = `${rootDir}/.schema-uploads/${resourceId}/${file.originalname}`;
    return new Promise((resolve, reject) => {
      try {
        writeFileSync(writeDir, file.buffer);
        console.log(writeDir);
        resolve(writeDir);
      } catch (error) {
        reject(error);
      }
    });
  }

  getSchema(filePath: string): Schema {
    const source = readFileSync(filePath, {
      encoding: "utf8",
    });
    return getSchema(source);
  }

  prepareSchema(schema: Schema): SchemaEntityFields[] {
    const entities = schema.list
      .filter((item: Model) => item.type === "model")
      .map((item: Model) => {
        const modelAttributes = item.properties.filter(
          (prop) => prop.type === "attribute"
        );
        const modelFields = item.properties.filter(
          (prop) => prop.type === "field"
        );

        return {
          name: item.name,
          displayName: capitalizeFirstLetter(item.name),
          pluralDisplayName: pluralize(capitalizeFirstLetter(item.name)),
          pluralName: pluralize(item.name.toLowerCase()),
          description: null,
          customAttributes: prepareModelAttributes(modelAttributes),
          fields: modelFields.map((field: Field) => {
            return {
              name: field.name,
              displayName: capitalizeFirstLetter(field.name),
              dataType: field.fieldType,
              required: field.optional,
              unique: field.attributes?.some((attr) => attr.name === "unique"),
              properties: {},
              customAttributes: filterOutAmplicatoinAttributes(
                prepareModelAttributes(field.attributes)
              ),
            };
          }),
        };
      });

    return entities;
  }

  saveAsJsonSchema(schemaObj: object, filePath: string) {
    // get the file dir from the filePath
    const fileDir = filePath.split("/").slice(0, -1).join("/");
    writeFile(
      `${fileDir}/schema.json`,
      JSON.stringify(schemaObj, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  /**
   *  TODO: add schema validation
   * for example, check that the schema has at least one model, doesn't have duplicate models, enums, etc.
   * return a list of errors
   *
   */
}
