import { InputType, Field } from "@nestjs/graphql";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";
import { EnumOutdatedVersionAlertTypeFilter } from "./EnumOutdatedVersionAlertTypeFilter";
import { EnumOutdatedVersionAlertStatusFilter } from "./EnumOutdatedVersionAlertStatusFilter";

@InputType({
  isAbstract: true,
})
export class OutdatedVersionAlertWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput)
  resource?: WhereUniqueInput;

  @Field(() => WhereUniqueInput)
  block?: WhereUniqueInput;

  @Field(() => StringFilter, {
    nullable: true,
  })
  outdatedVersion?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  latestVersion?: StringFilter | null;

  @Field(() => EnumOutdatedVersionAlertTypeFilter, {
    nullable: true,
  })
  type?: EnumOutdatedVersionAlertTypeFilter | null;

  @Field(() => EnumOutdatedVersionAlertStatusFilter, {
    nullable: true,
  })
  status?: EnumOutdatedVersionAlertStatusFilter | null;
}
