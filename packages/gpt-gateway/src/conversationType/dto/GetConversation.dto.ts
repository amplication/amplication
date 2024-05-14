import { GptConversationComplete } from "@amplication/schema-registry";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateConversation extends GptConversationComplete.Value {
  @Field(() => String, {
    nullable: false,
  })
  declare requestUniqueId: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  declare success: boolean;

  @Field(() => String, {
    nullable: true,
  })
  declare result?: string;

  @Field(() => String, {
    nullable: true,
  })
  declare errorMessage?: string;
}
