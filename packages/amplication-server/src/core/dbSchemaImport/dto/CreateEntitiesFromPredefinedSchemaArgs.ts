import { ArgsType, Field } from "@nestjs/graphql";
import { CreateEntitiesFromPredefinedSchemaInput } from "./CreateEntitiesFromPredefinedSchemaInput";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

@ArgsType()
export class CreateEntitiesFromPredefinedSchemaArgs {
  @ValidateNested()
  @Type(() => CreateEntitiesFromPredefinedSchemaInput)
  @Field(() => CreateEntitiesFromPredefinedSchemaInput, { nullable: false })
  data!: CreateEntitiesFromPredefinedSchemaInput;
}
