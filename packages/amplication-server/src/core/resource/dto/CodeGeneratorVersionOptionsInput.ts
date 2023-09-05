import { Field, InputType } from "@nestjs/graphql";
import { CodeGeneratorVersionStrategy } from "./EnumCodeGeneratorVersionStrategy";

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
