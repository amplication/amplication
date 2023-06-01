import { ArgsType, Field } from "@nestjs/graphql";
import { FileUploadInput } from "./FileUploadInput";

@ArgsType()
export class createEntitiesFromSchemaArgs {
  @Field(() => FileUploadInput, { nullable: false })
  data!: FileUploadInput;
}
