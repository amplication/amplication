import { DefaultEntitiesInput } from "./DefaultEntitiesInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateDefaultEntitiesArgs {
  @Field(() => DefaultEntitiesInput, { nullable: false })
  data!: DefaultEntitiesInput;
}
