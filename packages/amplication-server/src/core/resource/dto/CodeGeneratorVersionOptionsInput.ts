import { CodeGeneratorVersionStrategy } from "./EnumCodeGeneratorVersionStrategy";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CodeGeneratorVersionOptionsInput {
  @Field(() => String, {
    nullable: true,
  })
  codeGeneratorVersion?: string;

  @Field(() => CodeGeneratorVersionStrategy, {
    nullable: true,
  })
  codeGeneratorStrategy?: CodeGeneratorVersionStrategy;
}
