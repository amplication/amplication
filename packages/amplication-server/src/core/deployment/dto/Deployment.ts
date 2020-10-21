import { ObjectType, Field } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { User } from 'src/models/User'; // eslint-disable-line import/no-cycle
import { EnumDeploymentStatus } from './EnumDeploymentStatus';
import { Build } from '../../build/dto/Build'; // eslint-disable-line import/no-cycle
import { Environment } from '../../environment/dto/Environment'; // eslint-disable-line import/no-cycle
import { Action } from '../../action/dto/Action'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Deployment {
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

  @Field(() => User)
  createdBy?: User;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  userId!: string;

  @Field(() => Build)
  build?: Build;

  @Field(() => String)
  buildId!: string;

  @Field(() => Environment)
  environment?: Environment;

  @Field(() => String)
  environmentId!: string;

  @Field(() => EnumDeploymentStatus, {
    nullable: false
  })
  status!: EnumDeploymentStatus;

  @Field(() => String)
  message?: string;

  @Field(() => String)
  actionId: string;

  @Field(() => Action, {
    nullable: true
  })
  action?: Action;

  statusQuery?: JsonValue;
  statusUpdatedAt?: Date;
}
