import { Field, InputType } from "@nestjs/graphql";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { DateTimeFilter, StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class RoleWhereInput {
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

  @Field(() => String, {
    nullable: true,
  })
  key?: string | null;

  workspace?: WorkspaceWhereInput | null;
}
