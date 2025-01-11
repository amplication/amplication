import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto/";
import { EnumResourceTypeGroup } from "./EnumResourceTypeGroup";

@InputType({
  isAbstract: true,
})
export class PendingChangesFindInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  project!: WhereUniqueInput;

  @Field(() => EnumResourceTypeGroup, { nullable: false })
  resourceTypeGroup!: keyof typeof EnumResourceTypeGroup;
}
