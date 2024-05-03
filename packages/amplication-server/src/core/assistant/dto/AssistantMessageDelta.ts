import { Field, ObjectType } from "@nestjs/graphql";
import { EnumAssistantFunctions } from "./EnumAssistantFunctions";

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

  @Field(() => Boolean, {
    nullable: false,
  })
  completed: boolean;

  @Field(() => EnumAssistantFunctions, {
    nullable: true,
  })
  functionExecuted?: EnumAssistantFunctions;
}
