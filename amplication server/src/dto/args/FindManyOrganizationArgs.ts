import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { OrganizationOrderByInput } from "../inputs";
import { OrganizationWhereInput } from "../inputs";
import { OrganizationWhereUniqueInput } from "../inputs";

@ArgsType()
export class FindManyOrganizationArgs {
  @Field(_type => OrganizationWhereInput, { nullable: true })
  where?: OrganizationWhereInput | null;

  @Field(_type => OrganizationOrderByInput, { nullable: true })
  orderBy?: OrganizationOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => OrganizationWhereUniqueInput, { nullable: true })
  after?: OrganizationWhereUniqueInput | null;

  @Field(_type => OrganizationWhereUniqueInput, { nullable: true })
  before?: OrganizationWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
