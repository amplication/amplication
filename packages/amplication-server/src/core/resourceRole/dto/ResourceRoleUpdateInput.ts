import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class ResourceRoleUpdateInput {
  @Field(() => String, {
    nullable: true
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true
  })
  description?: string | null;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;
}
