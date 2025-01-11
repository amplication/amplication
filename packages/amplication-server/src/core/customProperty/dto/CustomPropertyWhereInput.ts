import { Field, InputType } from "@nestjs/graphql";
import { WorkspaceWhereInput } from "../../workspace/dto";
import { DateTimeFilter, StringFilter } from "../../../dto";
import { BlueprintWhereInput } from "../../blueprint/dto/BlueprintWhereInput";

@InputType({
  isAbstract: true,
})
export class CustomPropertyWhereInput {
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
  blueprintId?: string | null;

  @Field(() => BlueprintWhereInput, {
    nullable: true,
  })
  blueprint?: BlueprintWhereInput | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  enabled?: boolean | null;

  workspace?: WorkspaceWhereInput | null;
}
