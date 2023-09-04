import { Field, InputType } from "@nestjs/graphql";
import { EntityFieldWhereInput } from "./EntityFieldWhereInput";

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
