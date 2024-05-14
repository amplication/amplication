import { Field, ObjectType } from "@nestjs/graphql";
import { EnumAssistantMessageRole } from "./EnumAssistantMessageRole";

@ObjectType({
  isAbstract: true,
})
export class AssistantMessage {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => EnumAssistantMessageRole, {
    nullable: false,
  })
  role: keyof typeof EnumAssistantMessageRole;

  @Field(() => String, {
    nullable: false,
  })
  text: string;
}
