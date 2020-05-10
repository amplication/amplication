import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ProjectUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;
}
