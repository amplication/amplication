import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from './Account';
import { Organization } from './Organization';
import { UserRole } from './UserRole';

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

  @Field(() => Organization, {
    nullable: true,
    description: undefined
  })
  organization?: Organization;

  @Field(() => [UserRole], {
    nullable: true,
    description: undefined
  })
  userRoles?: UserRole[] | null;
}
