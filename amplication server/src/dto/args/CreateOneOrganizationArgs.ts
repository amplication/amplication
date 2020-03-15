import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { OrganizationCreateInput } from "../inputs";

@ArgsType()
export class CreateOneOrganizationArgs {
  @Field(_type => OrganizationCreateInput, { nullable: false })
  data!: OrganizationCreateInput;
}
