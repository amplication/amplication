import { ProjectWhereInput } from "./ProjectWhereInput";
import { InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ProjectFindFirstArgs {
  where?: ProjectWhereInput;
}
