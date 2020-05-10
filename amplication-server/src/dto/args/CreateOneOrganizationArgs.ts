import { ArgsType, Field } from "@nestjs/graphql";
import { OrganizationCreateInput } from "../inputs";

@ArgsType()
export class CreateOneOrganizationArgs {
  @Field(_type => OrganizationCreateInput, { nullable: false })
  data!: OrganizationCreateInput;
}
