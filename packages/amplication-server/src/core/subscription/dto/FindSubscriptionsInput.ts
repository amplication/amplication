import { InputType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto/WhereUniqueInput";
import { EnumSubscriptionStatusFilter } from "./EnumSubscriptionStatusFilter";

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
