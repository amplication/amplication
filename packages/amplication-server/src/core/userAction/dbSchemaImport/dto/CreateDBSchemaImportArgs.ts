import { ArgsType, Field } from "@nestjs/graphql";
import { DBSchemaImportCreateInput } from "./DBSchemaImportCreateInput";

@ArgsType()
export class CreateDBSchemaImportArgs {
  @Field(() => DBSchemaImportCreateInput, { nullable: false })
  data!: DBSchemaImportCreateInput;
}
