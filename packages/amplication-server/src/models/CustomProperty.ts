import { Field, ObjectType } from "@nestjs/graphql";
import { EnumCustomPropertyType } from "../core/customProperty/dto/EnumCustomPropertyType";
import { Workspace } from "./Workspace";

@ObjectType({
  isAbstract: true,
})
export class CustomProperty {
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

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => EnumCustomPropertyType, {
    nullable: false,
  })
  type: keyof typeof EnumCustomPropertyType;

  workspace?: Workspace;

  workspaceId?: string;

  deletedAt?: Date;
}
