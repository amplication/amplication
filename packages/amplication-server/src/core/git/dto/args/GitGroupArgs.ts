import { ArgsType, Field } from "@nestjs/graphql";
import { GitGroupInput } from "../inputs/GitGroupInput";

@ArgsType()
export class GitGroupArgs {
  @Field(() => GitGroupInput, { nullable: false })
  where!: GitGroupInput;
}
