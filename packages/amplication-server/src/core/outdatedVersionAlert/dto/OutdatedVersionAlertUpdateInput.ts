import { Field, InputType } from "@nestjs/graphql";
import { EnumOutdatedVersionAlertStatus } from "./EnumOutdatedVersionAlertStatus";

@InputType({ isAbstract: true })
export class OutdatedVersionAlertUpdateInput {
  @Field(() => String, { nullable: true })
  status: keyof typeof EnumOutdatedVersionAlertStatus;
}
