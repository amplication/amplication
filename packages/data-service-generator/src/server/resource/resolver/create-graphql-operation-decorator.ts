import {
  EnumModuleActionGqlOperation,
  ModuleAction,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { convertTypeDefToGraphQLType } from "../dto/custom-types/create-graphql-field-decorator";
import { MUTATION_ID, QUERY_ID } from "../dto/nestjs-graphql.util";

/*
adds the @query or @mutation decorator to the class method
@graphql.Mutation(() => Post)
or
@graphql.Query(() => [Post])
*/
export function createGraphQLOperationDecorator(
  action: ModuleAction
): namedTypes.Decorator {
  const type = builders.arrowFunctionExpression(
    [],
    convertTypeDefToGraphQLType(action.outputType)
  );

  return builders.decorator(
    builders.callExpression(
      action.gqlOperation === EnumModuleActionGqlOperation.Query
        ? QUERY_ID
        : MUTATION_ID,
      [type]
    )
  );
}
