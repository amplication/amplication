import { ArgsType, Field } from "@nestjs/graphql";
import { OutdatedVersionAlertCreateInput } from "./OutdatedVersionAlertCreateInput";

@ArgsType()
export class CreateOutdatedVersionAlertArgs {
  @Field(() => OutdatedVersionAlertCreateInput, { nullable: false })
  data!: OutdatedVersionAlertCreateInput;
}
