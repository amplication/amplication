import { DBSchemaImportCreateInput } from "./DBSchemaImportCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateDBSchemaImportArgs {
  @Field(() => DBSchemaImportCreateInput, { nullable: false })
  data!: DBSchemaImportCreateInput;
}
