import { Field, InputType } from "@nestjs/graphql";
import { Entity } from "../../../models";

@InputType({
  isAbstract: true,
})
export class CopiedEntities extends Entity {
  @Field(() => Boolean, {
    nullable: false,
  })
  shouldDeleteFromSource!: boolean;
}
