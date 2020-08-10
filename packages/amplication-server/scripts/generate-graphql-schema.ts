/**
 * Generates a GraphQL schema by dynamically importing all the resolver modules
 * Assumes any module ending with .resolver.ts includes a class with a name
 * containing the text "Resolver"
 */

import * as fs from 'fs';
import * as path from 'path';
import fg from 'fast-glob';
import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory
} from '@nestjs/graphql';
import { printSchema } from 'graphql';

const SCHEMA_PATH = path.resolve(__dirname, '..', 'src', 'schema.graphql');
const HEADER = `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
`;

async function generateGraphQLSchema() {
  const resolverModulePaths = await fg('src/**/*.resolver.ts');
  const resolvers = await Promise.all(
    resolverModulePaths.map(async path => {
      const module = await import(path);
      const resolver = Object.values(module).find(
        (value): value is Function =>
          typeof value === 'function' && value.name.includes('Resolver')
      );
      if (!resolver) {
        throw new Error(
          `Could not find an exported class or function which name contains the text 'Resolver' in ${path}`
        );
      }
      return resolver;
    })
  );
  const gqlSchemaBuilderApp = await NestFactory.create(
    GraphQLSchemaBuilderModule
  );
  await gqlSchemaBuilderApp.init();

  const gqlSchemaFactory = gqlSchemaBuilderApp.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers);
  const code = printSchema(schema);
  await fs.promises.writeFile(SCHEMA_PATH, HEADER + code);
  console.info(SCHEMA_PATH);
}

if (require.main === module) {
  generateGraphQLSchema()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
