import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationCreateInput {
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
