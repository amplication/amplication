import { Field, ObjectType } from "@nestjs/graphql";
import { AssistantMessage } from "./AssistantMessage";

@ObjectType({
  isAbstract: true,
})
export class AssistantThread {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => [AssistantMessage], {
    nullable: true,
  })
  messages: AssistantMessage[];
}
