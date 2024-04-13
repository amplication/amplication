import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class AssistantMessageDelta {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  threadId!: string;

  @Field(() => String, {
    nullable: false,
  })
  text: string;

  @Field(() => String, {
    nullable: false,
  })
  snapshot: string;
}
