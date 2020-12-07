/**
 * Generates a GraphQL schema according to server code
 */

import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';

export default async function generateGraphQLSchema() {
  // Override PrismaClient $connect to prevent connections to the database
  PrismaClient.prototype.$connect = async function() {
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
