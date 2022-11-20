import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BooleanFilter {
  @Field(() => Boolean, {
    nullable: true,
  })
  equals?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  not?: boolean | null;
}
