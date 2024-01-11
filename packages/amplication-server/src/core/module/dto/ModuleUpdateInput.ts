import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ModuleUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  enabled?: boolean;
}
