import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "./WhereUniqueInput";

@InputType({
  isAbstract: true,
})
export class ConnectManyUniqueInput {
  @Field(() => [WhereUniqueInput], {
    nullable: false,
  })
  connect: WhereUniqueInput[];
}
