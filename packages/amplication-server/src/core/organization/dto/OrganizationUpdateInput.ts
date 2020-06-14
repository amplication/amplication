import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  address?: string | null;
}
