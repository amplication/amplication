import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @Field(() => Boolean, {
    nullable: true,
  })
  equals?: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  not?: boolean;
}
