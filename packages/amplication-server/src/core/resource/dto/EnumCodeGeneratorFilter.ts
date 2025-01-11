import { Field, InputType } from "@nestjs/graphql";
import { EnumCodeGenerator } from "./EnumCodeGenerator";

@InputType({
  isAbstract: true,
})
export class EnumCodeGeneratorFilter {
  @Field(() => EnumCodeGenerator, {
    nullable: true,
  })
  equals?: (typeof EnumCodeGenerator)[keyof typeof EnumCodeGenerator] | null;
}
