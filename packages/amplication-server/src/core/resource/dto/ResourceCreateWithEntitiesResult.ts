import { Resource } from "../../../models";
import { Build } from "../../build/dto/Build";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class ResourceCreateWithEntitiesResult {
  @Field(() => Resource)
  resource: Resource;

  @Field(() => Build, { nullable: true })
  build?: Build;
}
