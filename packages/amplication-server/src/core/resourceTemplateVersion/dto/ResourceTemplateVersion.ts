import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

@ObjectType({
  isAbstract: true,
})
export class ResourceTemplateVersion extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  serviceTemplateId!: string;

  @Field(() => String, {
    nullable: false,
  })
  version!: string;
}
