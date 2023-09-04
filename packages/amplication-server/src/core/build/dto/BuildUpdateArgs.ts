import { ArgsType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { BuildUpdateInput } from "./BuildUpdateInput";

@ArgsType()
export class BuildUpdateArgs {
  data!: BuildUpdateInput;
  where!: WhereUniqueInput;
}
