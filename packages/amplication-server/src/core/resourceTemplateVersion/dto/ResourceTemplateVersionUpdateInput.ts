import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class ResourceTemplateVersionUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  serviceTemplateId!: string;

  @Field(() => String, {
    nullable: false,
  })
  version!: string;
}
