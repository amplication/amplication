import { Field, InputType } from "@nestjs/graphql";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { DateTimeFilter, StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class BlueprintWhereInput {
  @Field(() => String, {
    nullable: true,
  })
  id?: string | null;

  deletedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  key?: StringFilter | null;

  workspace?: WorkspaceWhereInput | null;
}
