import { Field, ObjectType } from "@nestjs/graphql";
import { Workspace } from "./Workspace";
import { BlueprintRelation } from "./BlueprintRelation";
import { CustomProperty } from "./CustomProperty";
import { EnumResourceType } from "../core/resource/dto/EnumResourceType";

@ObjectType({
  isAbstract: true,
})
export class Blueprint {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  key!: string;

  @Field(() => String, {
    nullable: true,
  })
  color?: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => [BlueprintRelation], {
    nullable: true,
  })
  relations?: BlueprintRelation[] | null | undefined;

  @Field(() => [CustomProperty], {
    nullable: true,
  })
  properties?: CustomProperty[];

  workspace?: Workspace;

  workspaceId?: string;

  deletedAt?: Date;

  // instead of exposing the value of this field, we expose an enum using resolveField on the blueprintResolver
  codeGeneratorName?: string;

  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => Boolean, { nullable: false })
  useBusinessDomain!: boolean;
}
