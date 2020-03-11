import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { OrganizationUpdateInput } from "../inputs";
import { OrganizationWhereUniqueInput } from "../inputs";

@ArgsType()
export class UpdateOneOrganizationArgs {
  @Field(_type => OrganizationUpdateInput, { nullable: false })
  data!: OrganizationUpdateInput;

  @Field(_type => OrganizationWhereUniqueInput, { nullable: false })
  where!: OrganizationWhereUniqueInput;
}
