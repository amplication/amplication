import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class ScaffoldServiceFromTemplateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => WhereParentIdInput, { nullable: false })
  project!: WhereParentIdInput;

  @Field(() => String, { nullable: false })
  serviceTemplateName: string;
}
