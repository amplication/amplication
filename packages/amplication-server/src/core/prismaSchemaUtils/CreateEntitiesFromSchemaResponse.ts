import { Field, ObjectType } from "@nestjs/graphql";
import { Entity } from "../../models";
import { ErrorMessage } from "./ErrorMessages";

@ObjectType()
export class CreateEntitiesFromSchemaResponse {
  @Field(() => [Entity], { nullable: false })
  entities!: Entity[];

  @Field(() => [ErrorMessage], { nullable: true })
  errors: ErrorMessage[] | null;
}
