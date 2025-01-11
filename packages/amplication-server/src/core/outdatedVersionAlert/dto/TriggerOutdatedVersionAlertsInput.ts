import { InputType, Field } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumOutdatedVersionAlertType } from "./EnumOutdatedVersionAlertType";

@InputType({
  isAbstract: true,
})
export class TriggerOutdatedVersionAlertsInput {
  @Field(() => WhereParentIdInput)
  changedResource!: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  block?: WhereParentIdInput;

  @Field(() => EnumOutdatedVersionAlertType, { nullable: false })
  type!: keyof typeof EnumOutdatedVersionAlertType;

  @Field(() => String)
  outdatedVersion: string;

  @Field(() => String)
  latestVersion: string;
}
