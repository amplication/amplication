import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { ModuleDtoProperty } from "./ModuleDtoProperty";

@InputType({
  isAbstract: true,
})
export class ModuleDtoUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => [ModuleDtoProperty], {
    nullable: false,
  })
  properties?: ModuleDtoProperty[];
}
