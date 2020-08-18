import { InputType, Field } from '@nestjs/graphql';
import { EnumBuildStatus } from './EnumBuildStatus';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumBuildStatusFilter {
  @Field(() => EnumBuildStatus, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumBuildStatus | null | undefined;

  @Field(() => EnumBuildStatus, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumBuildStatus | null | undefined;

  @Field(() => [EnumBuildStatus], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumBuildStatus> | null | undefined;

  @Field(() => [EnumBuildStatus], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof EnumBuildStatus> | null | undefined;
}
