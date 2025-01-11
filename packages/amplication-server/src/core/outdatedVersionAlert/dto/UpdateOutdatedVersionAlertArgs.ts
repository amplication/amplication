import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { OutdatedVersionAlertUpdateInput } from "./OutdatedVersionAlertUpdateInput";

@ArgsType()
export class UpdateOutdatedVersionAlertArgs {
  @Field(() => OutdatedVersionAlertUpdateInput, { nullable: false })
  data!: OutdatedVersionAlertUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
