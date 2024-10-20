import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PrivatePluginVersion } from "./PrivatePluginVersion";
import { EnumCodeGenerator } from "../../resource/dto/EnumCodeGenerator";

@InputType({
  isAbstract: true,
})
export class PrivatePluginUpdateInput extends BlockUpdateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => EnumCodeGenerator, {
    nullable: true,
  })
  codeGenerator?: keyof typeof EnumCodeGenerator;

  //versions cannot be updated directly, only through the PrivatePluginVersionUpdateInput
  versions?: PrivatePluginVersion[];
}
