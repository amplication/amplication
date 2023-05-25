import { Field, InputType } from "@nestjs/graphql";
import { DateTimeFilter, StringFilter } from "../../../dto";
import { WorkspaceWhereInput } from "../../workspace/dto";

@InputType({
  isAbstract: true,
})
export class UserWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => WorkspaceWhereInput, {
    nullable: true,
  })
  workspace?: WorkspaceWhereInput | null;
}
