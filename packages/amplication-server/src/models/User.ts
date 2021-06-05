import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from './Account'; // eslint-disable-line import/no-cycle
import { Workspace } from './Workspace'; // eslint-disable-line import/no-cycle
import { UserRole } from './UserRole'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class User {
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

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  @Field(() => Account, {
    nullable: true,
    description: undefined
  })
  account?: Account;

  @Field(() => Workspace, {
    nullable: true,
    description: undefined
  })
  workspace?: Workspace;

  @Field(() => [UserRole], {
    nullable: true,
    description: undefined
  })
  userRoles?: UserRole[] | null;

  @Field(() => Boolean, {
    nullable: false
  })
  isOwner?: boolean;
}
