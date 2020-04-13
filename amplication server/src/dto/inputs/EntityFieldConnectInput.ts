import { Field, InputType } from "@nestjs/graphql";
//import { EntityFieldCreateWithoutEntityVersionInput } from "../inputs/EntityFieldCreateWithoutEntityVersionInput";
import { WhereUniqueInput } from "./WhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityFieldConnectInput {

  @Field(_type => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: WhereUniqueInput[] | null;
}
