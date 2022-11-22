import { EnumResourceType } from "./EnumResourceType";
import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class ResourceCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  description!: string;

  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => WhereParentIdInput, { nullable: false })
  project!: WhereParentIdInput;
}
