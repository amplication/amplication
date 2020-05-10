import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  equals?: boolean | null;

  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  not?: boolean | null;
}
