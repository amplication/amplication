import { Field, ObjectType } from "@nestjs/graphql";
import { Block, Resource } from "../../../models";
import { EnumOutdatedVersionAlertStatus } from "./EnumOutdatedVersionAlertStatus";
import { EnumOutdatedVersionAlertType } from "./EnumOutdatedVersionAlertType";

@ObjectType({
  isAbstract: true,
})
export class OutdatedVersionAlert {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => Resource, { nullable: true })
  resource?: Resource;

  @Field(() => String, { nullable: false })
  resourceId!: string;

  @Field(() => String, { nullable: true })
  blockId?: string;

  @Field(() => Block, { nullable: true })
  block?: Block | null;

  @Field(() => EnumOutdatedVersionAlertType, { nullable: false })
  type!: keyof typeof EnumOutdatedVersionAlertType;

  @Field(() => String, { nullable: false })
  outdatedVersion!: string;

  @Field(() => String, { nullable: false })
  latestVersion!: string;

  @Field(() => EnumOutdatedVersionAlertStatus, { nullable: false })
  status!: keyof typeof EnumOutdatedVersionAlertStatus;
}
