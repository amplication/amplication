import { WhereUniqueInput } from "../../../dto/WhereUniqueInput";
import { EnumSubscriptionStatusFilter } from "./EnumSubscriptionStatusFilter";
import { InputType, Field } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class FindSubscriptionsInput {
  workspace!: WhereUniqueInput;

  @Field(() => EnumSubscriptionStatusFilter, {
    nullable: true,
  })
  status?: EnumSubscriptionStatusFilter | null;
}
