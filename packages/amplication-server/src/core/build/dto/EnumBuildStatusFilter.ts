import * as TypeGraphQL from 'type-graphql';
import { EnumBuildStatus } from './EnumBuildStatus';

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined
})
export class EnumBuildStatusFilter {
  @TypeGraphQL.Field(() => EnumBuildStatus, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumBuildStatus | null | undefined;

  @TypeGraphQL.Field(() => EnumBuildStatus, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumBuildStatus | null | undefined;

  @TypeGraphQL.Field(() => [EnumBuildStatus], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumBuildStatus> | null | undefined;

  @TypeGraphQL.Field(() => [EnumBuildStatus], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof EnumBuildStatus> | null | undefined;
}
