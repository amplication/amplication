import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput, WhereUniqueInput } from "../../../dto";

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
}
