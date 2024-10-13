import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class PrivatePluginVersionCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  version!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  privatePlugin!: WhereParentIdInput;
}
