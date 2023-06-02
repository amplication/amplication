import { ArgsType, Field } from "@nestjs/graphql";
import { FileUploadInput } from "./FileUploadInput";

@ArgsType()
export class CreateEntitiesFromSchemaArgs {
  @Field(() => FileUploadInput, { nullable: false })
  data!: FileUploadInput;
}
