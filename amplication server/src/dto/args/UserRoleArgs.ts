import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { UserRoleInput,WhereUniqueInput } from '../inputs';

@ArgsType()
export class UserRoleArgs {
  @Field(_type => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
