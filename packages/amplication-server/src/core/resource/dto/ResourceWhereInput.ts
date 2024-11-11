import { Field, InputType } from "@nestjs/graphql";
import { BooleanFilter, DateTimeFilter, StringFilter } from "../../../dto";
import { ProjectWhereInput } from "../../project/dto/ProjectWhereInput";
import { EnumResourceTypeFilter } from "./EnumResourceTypeFilter";
import { OwnershipWhereInput } from "../../ownership/dto/OwnershipWhereInput";

@InputType({
  isAbstract: true,
})
export class ResourceWhereInput {
  @Field(() => String, {
    nullable: true,
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  description?: StringFilter | null;

  @Field(() => ProjectWhereInput, { nullable: true })
  project?: ProjectWhereInput | null;

  @Field(() => String, { nullable: true })
  projectId?: string | null;

  @Field(() => String, { nullable: true })
  serviceTemplateId?: string | null;

  @Field(() => EnumResourceTypeFilter, {
    nullable: true,
  })
  resourceType?: EnumResourceTypeFilter | null;

  @Field(() => OwnershipWhereInput, {
    nullable: true,
  })
  ownership?: OwnershipWhereInput | null;

  //do not expose to graphql
  deletedAt?: DateTimeFilter;

  archived?: BooleanFilter;
}
