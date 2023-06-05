import { ArgsType, Field } from "@nestjs/graphql";
import { CreateEntitiesFromPrismaSchemaInput } from "./CreateEntitiesFromPrismaSchemaInput";

@ArgsType()
export class CreateEntitiesFromSchemaArgs {
  @Field(() => CreateEntitiesFromPrismaSchemaInput, { nullable: false })
  data!: CreateEntitiesFromPrismaSchemaInput;
}
