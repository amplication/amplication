import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { UserRoleInput,UserWhereUniqueInput } from '../inputs';

@ArgsType()
export class UserRoleArgs {
  @Field(_type => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}
