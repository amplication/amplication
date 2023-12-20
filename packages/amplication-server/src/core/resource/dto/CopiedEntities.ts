import { Field, InputType } from "@nestjs/graphql";
import { Entity } from "packages/amplication-server/src/models";

@InputType({
  isAbstract: true,
})
export class CopiedEntities extends Entity {
  @Field(() => Boolean, {
    nullable: false,
  })
  shouldDeleteFromSource!: boolean;
}
