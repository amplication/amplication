import { EntityFieldWhereInput } from "./EntityFieldWhereInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityFieldFilter {
  @Field(() => EntityFieldWhereInput, {
    nullable: true,
  })
  every?: EntityFieldWhereInput | null;

  @Field(() => EntityFieldWhereInput, {
    nullable: true,
  })
  some?: EntityFieldWhereInput | null;

  @Field(() => EntityFieldWhereInput, {
    nullable: true,
  })
  none?: EntityFieldWhereInput | null;
}
