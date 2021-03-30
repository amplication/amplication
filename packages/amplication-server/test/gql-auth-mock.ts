import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import set from 'lodash.set';

/**
 * Creates a mock implementation of GqlAuthGuard.canActivate with given user
 * @param user to inject in the GraphQL context request
 * @returns mock implementation function of canActivate
 * @example
 * const canActivateMock = jest.fn();
 * canActivateMock.mockImplementation(mockGqlAuthGuardCanActivate({
 *  id: "exampleUserId"
 * }))
 */
/* eslint-disable @typescript-eslint/ban-types */
export const mockGqlAuthGuardCanActivate = (user: object) => (
  executionContext: ExecutionContext
): boolean => {
  const gqlExecutionContext = GqlExecutionContext.create(executionContext);
  const gqlContext = gqlExecutionContext.getContext();
  // Set user for injectContextValue to work properly
  set(gqlContext, ['req', 'user'], user);
  return true;
};
