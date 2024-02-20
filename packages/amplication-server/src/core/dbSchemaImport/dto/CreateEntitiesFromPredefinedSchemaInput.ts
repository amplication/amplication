import { InputType, Field } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumSchemaNames } from "./EnumSchemaNames";

@InputType({
  isAbstract: true,
})
export class CreateEntitiesFromPredefinedSchemaInput {
  @Field(() => WhereParentIdInput, { nullable: false })
  resource!: WhereParentIdInput;

  @Field(() => EnumSchemaNames, { nullable: false })
  schemaName!: EnumSchemaNames;
}
