import { WhereUniqueInput } from "../../../dto";
import { BuildUpdateInput } from "./BuildUpdateInput";

export class BuildUpdateArgs {
  data!: BuildUpdateInput;
  where!: WhereUniqueInput;
}
