import { SortOrder } from "../../../enums/SortOrder";
import { InputType, Field } from "@nestjs/graphql";
import { ResourceOrderByInput } from "../../resource/dto";
import { BlockOrderByInput } from "../../block/dto";

@InputType({
  isAbstract: true,
})
export class OutdatedVersionAlertOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  createdAt?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  updatedAt?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  outdatedVersion?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  latestVersion?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  type?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
  })
  status?: SortOrder | null | undefined;

  @Field(() => ResourceOrderByInput, {
    nullable: true,
  })
  resource?: ResourceOrderByInput | null | undefined;

  @Field(() => BlockOrderByInput, {
    nullable: true,
  })
  block?: BlockOrderByInput | null | undefined;
}
