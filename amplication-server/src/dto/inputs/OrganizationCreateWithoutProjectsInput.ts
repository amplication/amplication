import { Field, InputType } from '@nestjs/graphql';
//import { AccountUserCreateManyWithoutOrganizationInput } from "../inputs/AccountUserCreateManyWithoutOrganizationInput";

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationCreateWithoutProjectsInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  defaultTimeZone!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  address!: string;
}
