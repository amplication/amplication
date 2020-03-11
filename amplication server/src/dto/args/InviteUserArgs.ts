import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { InviteUserInput } from '../inputs';

@ArgsType()
export class InviteUserArgs {
  @Field(_type => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
