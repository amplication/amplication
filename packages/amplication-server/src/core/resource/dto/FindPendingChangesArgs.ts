import { PendingChangesFindInput } from "./PendingChangesFindInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindPendingChangesArgs {
  @Field(() => PendingChangesFindInput, { nullable: false })
  where!: PendingChangesFindInput;
}
