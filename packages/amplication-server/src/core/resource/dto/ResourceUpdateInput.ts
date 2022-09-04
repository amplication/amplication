import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class ResourceUpdateInput {
  @Field(() => String, {
    nullable: true
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true
  })
  description?: string | null;

  @Field(() => Boolean, { nullable: true })
  gitRepositoryOverride?: boolean | null;
}
