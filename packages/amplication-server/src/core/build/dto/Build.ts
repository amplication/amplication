import { ObjectType, Field } from '@nestjs/graphql';
import { BlockVersion } from 'src/models/BlockVersion'; // eslint-disable-line import/no-cycle
import { EntityVersion } from 'src/models/EntityVersion'; // eslint-disable-line import/no-cycle
import { User } from 'src/models/User'; // eslint-disable-line import/no-cycle
import { EnumBuildStatus } from './EnumBuildStatus';
import { App, Commit } from 'src/models'; // eslint-disable-line import/no-cycle
import { Action } from '../../action/dto/Action'; // eslint-disable-line import/no-cycle
import { Deployment } from '../../deployment/dto/Deployment'; // eslint-disable-line import/no-cycle
import { JsonValue } from 'type-fest';

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

  @Field(() => User)
  createdBy?: User;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  userId!: string;

  @Field(() => EnumBuildStatus, {
    nullable: true,
    description: undefined
  })
  status?: keyof typeof EnumBuildStatus;

  @Field(() => String)
  archiveURI?: string;

  blockVersions?: BlockVersion[] | null | undefined;

  entityVersions?: EntityVersion[] | null | undefined;

  @Field(() => String, {
    nullable: false
  })
  version: string;

  @Field(() => String)
  message?: string;

  @Field(() => String)
  actionId: string;

  @Field(() => Action, {
    nullable: true
  })
  action?: Action;

  @Field(() => [Deployment], {
    nullable: true
  })
  deployments?: Deployment[];

  containerStatusQuery?: JsonValue;
  containerStatusUpdatedAt?: Date;
  images?: string[];

  @Field(() => Commit)
  commit?: Commit;

  @Field(() => String)
  commitId!: string;
}
