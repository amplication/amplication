import { Entity } from "../../../models";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CopiedEntities extends Entity {
  @Field(() => Boolean, {
    nullable: false,
  })
  shouldDeleteFromSource!: boolean;
}
