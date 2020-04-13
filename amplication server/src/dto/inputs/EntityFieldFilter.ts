import { Field, InputType } from "@nestjs/graphql";
import { EntityFieldWhereInput } from "./EntityFieldWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityFieldFilter {
  @Field(_type => EntityFieldWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: EntityFieldWhereInput | null;

  @Field(_type => EntityFieldWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: EntityFieldWhereInput | null;

  @Field(_type => EntityFieldWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: EntityFieldWhereInput | null;
}
