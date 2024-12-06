import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto/WhereParentIdInput";

@InputType({ isAbstract: true })
export class CustomPropertyCreateInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => WhereParentIdInput, { nullable: true })
  blueprint?: WhereParentIdInput;

  workspace?: {
    connect: {
      id: string;
    };
  };
}
