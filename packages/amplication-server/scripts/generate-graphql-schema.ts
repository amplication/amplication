/**
 * Generates a GraphQL schema according to server code
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as prisma from '@prisma/client';

export default async function generateGraphQLSchema() {
  // Override PrismaClient $connect ot avoid connecting to the database
  prisma.PrismaClient.prototype.$connect = async function() {
    return;
  };
  // Use the side effect of initializing the nest application for generating
  // the Nest.js schema
  const app = await NestFactory.create(AppModule);
  await app.init();
}

if (require.main === module) {
  generateGraphQLSchema()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
