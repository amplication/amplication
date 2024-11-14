import { Field, InputType } from "@nestjs/graphql";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { BooleanFilter, DateTimeFilter, StringFilter } from "../../../dto";

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

  @Field(() => BooleanFilter, {
    nullable: true,
  })
  platformIsPublic?: BooleanFilter | null;

  workspace?: WorkspaceWhereInput | null;
}
