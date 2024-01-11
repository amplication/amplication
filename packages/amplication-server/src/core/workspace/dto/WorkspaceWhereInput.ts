import { DateTimeFilter, StringFilter } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WorkspaceWhereInput {
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
}
