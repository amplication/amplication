import { Field, InputType } from "@nestjs/graphql";


@InputType({
  isAbstract: true,
  description: undefined,
})
export class OrganizationUpdateInput {

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  address?: string | null;

}
