import { Field, InputType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class WhereUniqueInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  id: string ;
}
