import { ArgsType, Field } from "@nestjs/graphql";
import { CreateEntitiesFromPrismaSchemaInput } from "./CreateEntitiesFromPrismaSchemaInput";

@ArgsType()
export class CreateEntitiesFromPrismaSchemaArgs {
  @Field(() => CreateEntitiesFromPrismaSchemaInput, { nullable: false })
  data!: CreateEntitiesFromPrismaSchemaInput;
}
