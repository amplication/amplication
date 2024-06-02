import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class ModuleActionCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;
}
