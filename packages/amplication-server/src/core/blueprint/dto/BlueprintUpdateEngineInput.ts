import { Field, InputType } from "@nestjs/graphql";
import { EnumResourceType } from "../../resource/dto/EnumResourceType";
import { EnumCodeGenerator } from "../../resource/dto/EnumCodeGenerator";

@InputType({ isAbstract: true })
export class BlueprintUpdateEngineInput {
  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => EnumCodeGenerator, {
    nullable: true,
  })
  codeGenerator?: keyof typeof EnumCodeGenerator | null;
}
