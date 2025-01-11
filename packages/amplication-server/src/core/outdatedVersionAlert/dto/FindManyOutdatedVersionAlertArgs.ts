import { Field, ArgsType, Int } from "@nestjs/graphql";
import { OutdatedVersionAlertOrderByInput } from "./OutdatedVersionAlertOrderByInput";
import { OutdatedVersionAlertWhereInput } from "./OutdatedVersionAlertWhereInput";

@ArgsType()
export class FindManyOutdatedVersionAlertArgs {
  @Field(() => OutdatedVersionAlertWhereInput, { nullable: true })
  where?: OutdatedVersionAlertWhereInput | null | undefined;

  @Field(() => OutdatedVersionAlertOrderByInput, { nullable: true })
  orderBy?: OutdatedVersionAlertOrderByInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
