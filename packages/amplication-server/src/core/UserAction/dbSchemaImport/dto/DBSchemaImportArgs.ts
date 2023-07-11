import { ArgsType, Field } from "@nestjs/graphql";
import { UserActionCreateInput } from "../../dto";

@ArgsType()
export class DBSchemaImportArgs {
  @Field(() => UserActionCreateInput, { nullable: false })
  data!: UserActionCreateInput;
}
