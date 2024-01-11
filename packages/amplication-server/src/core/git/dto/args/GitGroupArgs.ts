import { GitGroupInput } from "../inputs/GitGroupInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GitGroupArgs {
  @Field(() => GitGroupInput, { nullable: false })
  where!: GitGroupInput;
}
