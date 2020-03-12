import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Account } from "./Account";
import { Organization } from "./Organization";
import { UserRole } from "./UserRole";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  @Field(_type => Account, {
    nullable: true,
    description: undefined,
  })
  account?: Account;

  organization?: Organization;

  @Field(_type => [UserRole], {
    nullable: true,
    description: undefined,
  })
  userRoles?: UserRole[] | null;
}
