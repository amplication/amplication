import { Field, ObjectType } from '@nestjs/graphql';
import { Commit, Resource } from 'src/models'; // eslint-disable-line import/no-cycle
import { BlockVersion } from 'src/models/BlockVersion'; // eslint-disable-line import/no-cycle
import { EntityVersion } from 'src/models/EntityVersion'; // eslint-disable-line import/no-cycle
import { User } from 'src/models/User'; // eslint-disable-line import/no-cycle
import { Action } from '../../action/dto/Action'; // eslint-disable-line import/no-cycle
import { BuildStatus } from '@amplication/build-types';

@ObjectType({
  isAbstract: true
})
export class Build {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Resource)
  resource?: Resource;

  @Field(() => String)
  resourceId!: string;

  @Field(() => User)
  createdBy?: User;

  @Field(() => String, {
    nullable: false
  })
  userId!: string;

  @Field(() => BuildStatus, {
    nullable: true
  })
  status?: keyof typeof BuildStatus;

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

  @Field(() => Commit)
  commit?: Commit;

  @Field(() => String)
  commitId!: string;
}
