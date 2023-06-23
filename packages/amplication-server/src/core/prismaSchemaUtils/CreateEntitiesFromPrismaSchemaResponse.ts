import { Field, ObjectType } from "@nestjs/graphql";
import { Entity } from "../../models";
import { ActionLog } from "../action/dto";

@ObjectType()
export class CreateEntitiesFromPrismaSchemaResponse {
  @Field(() => [Entity], { nullable: false })
  entities!: Entity[];

  @Field(() => [ActionLog], { nullable: false })
  log!: ActionLog[];
}
