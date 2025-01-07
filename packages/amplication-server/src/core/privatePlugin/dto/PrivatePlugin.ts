import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { PrivatePluginVersion } from "./PrivatePluginVersion";
import { EnumCodeGenerator } from "../../resource/dto/EnumCodeGenerator";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class PrivatePlugin extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => EnumCodeGenerator, {
    nullable: false,
  })
  codeGenerator: keyof typeof EnumCodeGenerator;

  @Field(() => [PrivatePluginVersion], {
    nullable: false,
  })
  versions: PrivatePluginVersion[];

  @Field(() => [String], { nullable: true })
  blueprints?: string[];

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => String, { nullable: true })
  color?: string;
}
