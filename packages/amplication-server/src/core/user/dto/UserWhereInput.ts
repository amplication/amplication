import { DateTimeFilter, StringFilter } from "../../../dto";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { Field, InputType } from "@nestjs/graphql";

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
