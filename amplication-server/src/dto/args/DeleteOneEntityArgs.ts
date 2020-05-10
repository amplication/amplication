import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

@ArgsType()
export class DeleteOneEntityArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
