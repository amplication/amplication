import { DateTimeFilter, StringFilter } from "../../../dto";
import { ResourceListRelationFilter } from "../../resource/dto/ResourceListRelationFilter";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ProjectWhereInput {
  @Field(() => String, {
    nullable: true,
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  deletedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  workspace?: WorkspaceWhereInput | null;

  @Field(() => ResourceListRelationFilter, { nullable: true })
  resources?: ResourceListRelationFilter;
}
