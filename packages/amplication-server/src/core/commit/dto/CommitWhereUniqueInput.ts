import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CommitWhereUniqueInput {
  @Field(() => String, {
    nullable: false,
  })
  id: string;
}
