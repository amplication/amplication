import { EntityWhereInput } from "./EntityWhereInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityFilter {
  @Field(() => EntityWhereInput, {
    nullable: true,
  })
  every?: EntityWhereInput | null;

  @Field(() => EntityWhereInput, {
    nullable: true,
  })
  some?: EntityWhereInput | null;

  @Field(() => EntityWhereInput, {
    nullable: true,
  })
  none?: EntityWhereInput | null;
}
