import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput, WhereUniqueInput } from "../../../dto";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";

@InputType({
  isAbstract: true,
})
export class ResourceFromTemplateCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  description!: string;

  @Field(() => WhereParentIdInput, { nullable: false })
  project!: WhereParentIdInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  serviceTemplate: WhereUniqueInput;

  @Field(() => ConnectGitRepositoryInput, { nullable: true })
  gitRepository?: ConnectGitRepositoryInput;

  @Field(() => Boolean, { nullable: true })
  buildAfterCreation?: boolean;
}
