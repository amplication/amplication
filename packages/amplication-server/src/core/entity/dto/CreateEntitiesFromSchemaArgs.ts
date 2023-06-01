import { ArgsType, Field } from "@nestjs/graphql";
import { FilePathInput } from "./FilePathInput";

@ArgsType()
export class createEntitiesFromSchemaArgs {
  @Field(() => FilePathInput, { nullable: false })
  data!: FilePathInput;
}
