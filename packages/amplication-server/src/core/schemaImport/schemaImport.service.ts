import { Injectable } from "@nestjs/common";
import { createWriteStream, mkdirSync, readFileSync, writeFile } from "fs";
import { v4 as uuidv4 } from "uuid";
import { getSchema, Schema, Model, Field } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  prepareModelAttributes,
} from "./schema-utils";

@Injectable()
export class SchemaImportService {
  constructor() {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const rootDir = process.cwd();
    const randomUUid = uuidv4();
    mkdirSync(`${rootDir}/.schema-uploads/${randomUUid}`, { recursive: true });
    const writeDir = `${rootDir}/.schema-uploads/${randomUUid}/${file.originalname}`;
    return new Promise((resolve, reject) => {
      file.stream
        .pipe(createWriteStream(writeDir))
        .on("finish", () => resolve(writeDir))
        .on("error", (error) => reject(error));
    });
  }

  getSchema(filePath: string): Schema {
    const source = readFileSync(filePath, {
      encoding: "utf8",
    });
    return getSchema(source);
  }

  prepareSchemaObj(schema: Schema) {
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
              searchable: false,
            };
          }),
        };
      });

    return entities;
  }

  async saveAsJsonSchema(schemaObj: object, filePath: string): Promise<any> {
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
}
