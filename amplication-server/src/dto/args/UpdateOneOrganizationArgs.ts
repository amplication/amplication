import { ArgsType, Field } from "@nestjs/graphql";
import { OrganizationUpdateInput } from "../inputs";
import { WhereUniqueInput } from "../inputs";

@ArgsType()
export class UpdateOneOrganizationArgs {
  @Field(_type => OrganizationUpdateInput, { nullable: false })
  data!: OrganizationUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
