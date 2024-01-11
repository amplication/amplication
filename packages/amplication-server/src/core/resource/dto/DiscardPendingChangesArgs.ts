import { PendingChangesDiscardInput } from "./PendingChangesDiscardInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DiscardPendingChangesArgs {
  @Field(() => PendingChangesDiscardInput, { nullable: false })
  data!: PendingChangesDiscardInput;
}
