import { InputType, Field } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../../dto";
import { EnumUserActionType } from "../../types";

@InputType({
  isAbstract: true,
})
export class DBSchemaImportCreateInput {
  @Field(() => EnumUserActionType, { nullable: false })
  userActionType!: EnumUserActionType;

  @Field(() => WhereParentIdInput, { nullable: false })
  resource: WhereParentIdInput;
}
