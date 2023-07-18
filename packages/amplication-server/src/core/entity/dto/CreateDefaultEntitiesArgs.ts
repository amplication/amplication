import { ArgsType, Field } from "@nestjs/graphql";
import { DefaultEntitiesInput } from "./DefaultEntitiesInput";

@ArgsType()
export class CreateDefaultEntitiesArgs {
  @Field(() => DefaultEntitiesInput, { nullable: false })
  data!: DefaultEntitiesInput;
}
