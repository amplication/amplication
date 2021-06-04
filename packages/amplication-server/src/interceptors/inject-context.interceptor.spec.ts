import { TestingModule, Test } from '@nestjs/testing';
import * as NestJsGraphQL from '@nestjs/graphql';
import {
  InjectContextInterceptor,
  InjectContextValueParameters,
  INJECT_CONTEXT_VALUE
} from './inject-context.interceptor';
import { Reflector } from '@nestjs/core';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';

const EXAMPLE_HANDLER = () => null;
const EXAMPLE_INJECT_CONTEXT_VALUE_PARAMETERS: InjectContextValueParameters = {
  parameterPath: 'data.workspace.connect.id',
  parameterType: InjectableResourceParameter.WorkspaceId
};
const EXAMPLE_WORKSPACE_ID = 'ExampleWorkspaceId';

const reflectorGetMock = jest.fn(metadataKey => {
  switch (metadataKey) {
    case INJECT_CONTEXT_VALUE:
      return EXAMPLE_INJECT_CONTEXT_VALUE_PARAMETERS;
    default: {
      throw new Error('Unexpected metadataKey');
    }
  }
});

jest.mock('@nestjs/graphql');

const handleMock = jest.fn(() => null);

describe('InjectContextInterceptor', () => {
  let interceptor: InjectContextInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useClass: jest.fn(() => ({
            get: reflectorGetMock
          }))
        },
        InjectContextInterceptor
      ]
    }).compile();

    interceptor = module.get<InjectContextInterceptor>(
      InjectContextInterceptor
    );
  });

  test('should inject context value', () => {
    const request = {
      user: {
        workspace: {
          id: EXAMPLE_WORKSPACE_ID
        }
      }
    };
    const requestArgs: {
      data: { name: string; workspace?: { connect: { id: string } } };
    } = {
      data: { name: 'Foo' }
    };
    // eslint-disable-next-line
    // @ts-ignore
    NestJsGraphQL.GqlExecutionContext.create.mockReturnValue({
      getContext() {
        return {
          req: request
        };
      },
      getArgs() {
        return requestArgs;
      }
    });
    const context: any = {
      getHandler() {
        return EXAMPLE_HANDLER;
      }
    };
    const next = {
      handle: handleMock
    };
    interceptor.intercept(context, next);
    expect(reflectorGetMock).toBeCalledTimes(1);
    expect(reflectorGetMock).toBeCalledWith(
      INJECT_CONTEXT_VALUE,
      EXAMPLE_HANDLER
    );
    expect(handleMock).toBeCalledTimes(1);
    expect(handleMock).toBeCalledWith();
    expect(requestArgs.data.workspace.connect.id).toBe(EXAMPLE_WORKSPACE_ID);
  });
});
