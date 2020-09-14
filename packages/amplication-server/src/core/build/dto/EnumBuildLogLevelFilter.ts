import { InputType, Field } from '@nestjs/graphql';

import { EnumBuildLogLevel } from './EnumBuildLogLevel';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumBuildLogLevelFilter {
  @Field(() => EnumBuildLogLevel, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumBuildLogLevel | null;

  @Field(() => [EnumBuildLogLevel], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumBuildLogLevel> | null;
}
