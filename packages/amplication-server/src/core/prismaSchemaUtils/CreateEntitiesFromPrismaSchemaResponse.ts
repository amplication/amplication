import { Field, ObjectType } from "@nestjs/graphql";
import { Entity } from "../../models";
import { Action } from "../action/dto";

@ObjectType()
export class CreateEntitiesFromPrismaSchemaResponse {
  @Field(() => [Entity], { nullable: false })
  entities!: Entity[];

  @Field(() => Action, { nullable: false })
  actionLog!: Action;
}
