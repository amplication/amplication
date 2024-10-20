import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { EnumCodeGenerator } from "../../resource/dto/EnumCodeGenerator";

@InputType({
  isAbstract: true,
})
export class PrivatePluginCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled: boolean;

  @Field(() => EnumCodeGenerator, {
    nullable: false,
  })
  codeGenerator: keyof typeof EnumCodeGenerator;
}
