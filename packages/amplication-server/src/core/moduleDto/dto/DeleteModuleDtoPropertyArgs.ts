import { ArgsType, Field } from "@nestjs/graphql";
import { WherePropertyUniqueInput } from "./WherePropertyUniqueInput";

@ArgsType()
export class DeleteModuleDtoPropertyArgs {
  @Field(() => WherePropertyUniqueInput, { nullable: false })
  where!: WherePropertyUniqueInput;
}
