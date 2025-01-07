import { Field, InputType } from "@nestjs/graphql";
import { BlockTypeWhereInput } from "../../block/dto";
import { EnumCodeGeneratorFilter } from "../../resource/dto/EnumCodeGeneratorFilter";

@InputType({
  isAbstract: true,
})
export class PrivatePluginWhereInput extends BlockTypeWhereInput {
  @Field(() => EnumCodeGeneratorFilter, {
    nullable: true,
  })
  codeGenerator?: EnumCodeGeneratorFilter | null;

  @Field(() => EnumCodeGeneratorFilter, {
    nullable: true,
  })
  blue?: EnumCodeGeneratorFilter | null;
}
