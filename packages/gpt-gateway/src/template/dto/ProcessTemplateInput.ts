import { Field, InputType } from "@nestjs/graphql";
import { MessageParam } from "../../dto/MessageParam";

@InputType()
class ProcessTemplateInput {
  @Field(() => String, {
    nullable: true,
  })
  templateId!: string;

  @Field(() => [MessageParam])
  params!: MessageParam[];
}

export { ProcessTemplateInput };
