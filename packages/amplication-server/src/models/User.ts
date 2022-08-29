import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from './Account'; // eslint-disable-line import/no-cycle
import { Workspace } from './Workspace'; // eslint-disable-line import/no-cycle
import { UserRole } from './UserRole'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class User {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => Account, {
    nullable: true
  })
  account?: Account;

  @Field(() => Workspace, {
    nullable: true
  })
  workspace?: Workspace;

  @Field(() => [UserRole], {
    nullable: true
  })
  userRoles?: UserRole[] | null;

  @Field(() => Boolean, {
    nullable: false
  })
  isOwner: boolean;
}
