import { TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';

/**
 * Wraps Apollo Server's createTestClient to easily work with Nest.js
 * @param testingModule the Nest.js testing module
 * @returns Apollo Server's test client
 */
export function createApolloServerTestClient(
  testingModule: TestingModule
): ApolloServerTestClient {
  // GraphQLModule doesn't expose the apolloServer property
  const graphqlModule = testingModule.get(GraphQLModule) as any;
  return createTestClient(graphqlModule.apolloServer);
}
