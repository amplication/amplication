import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ModuleCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;
}
