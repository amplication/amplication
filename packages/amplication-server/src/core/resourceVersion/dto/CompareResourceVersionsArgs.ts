import { ArgsType, Field } from "@nestjs/graphql";
import { CompareResourceVersionsWhereInput } from "./CompareResourceVersionsWhereInput";

@ArgsType()
export class CompareResourceVersionsArgs {
  @Field(() => CompareResourceVersionsWhereInput)
  where!: CompareResourceVersionsWhereInput;
}
