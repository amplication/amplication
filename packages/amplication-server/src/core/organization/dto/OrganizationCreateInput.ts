import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  defaultTimeZone!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  address!: string;
}
