import { WhereParentIdInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EnvironmentCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    nullable: false,
  })
  address!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  resource!: WhereParentIdInput;
}
