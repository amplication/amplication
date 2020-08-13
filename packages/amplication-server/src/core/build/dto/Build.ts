import { ObjectType, Field } from '@nestjs/graphql';
import { BlockVersion } from 'src/models/BlockVersion';
import { EntityVersion } from 'src/models/EntityVersion';
import { User } from 'src/models/User';
import { EnumBuildStatus } from './EnumBuildStatus';
import { App } from 'src/models';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Build {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => App)
  app?: App;

  @Field(() => String)
  appId!: string;

  createdBy?: User;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  userId!: string;

  @Field(() => EnumBuildStatus, {
    nullable: false,
    description: undefined
  })
  status!: keyof typeof EnumBuildStatus;

  blockVersions?: BlockVersion[] | null | undefined;

  entityVersions?: EntityVersion[] | null | undefined;
}
