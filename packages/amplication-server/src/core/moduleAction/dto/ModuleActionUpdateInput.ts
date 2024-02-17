import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { EnumModuleActionGqlOperation } from "./EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./EnumModuleActionRestVerb";
import { PropertyTypeDef } from "../../moduleDto/dto/propertyTypes/PropertyTypeDef";
import { EnumModuleActionRestInputSource } from "./EnumModuleActionRestInputSource";

@InputType({
  isAbstract: true,
})
export class ModuleActionUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name?: string | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  enabled?: boolean;

  @Field(() => EnumModuleActionGqlOperation, {
    nullable: true,
  })
  gqlOperation?: keyof typeof EnumModuleActionGqlOperation;

  @Field(() => EnumModuleActionRestVerb, {
    nullable: true,
  })
  restVerb?: keyof typeof EnumModuleActionRestVerb;

  @Field(() => String, {
    nullable: true,
  })
  path?: string;

  @Field(() => PropertyTypeDef, {
    nullable: true,
  })
  inputType?: PropertyTypeDef;

  @Field(() => PropertyTypeDef, {
    nullable: true,
  })
  outputType?: PropertyTypeDef;

  @Field(() => EnumModuleActionRestInputSource, {
    nullable: true,
  })
  restInputSource?: keyof typeof EnumModuleActionRestInputSource;

  @Field(() => String, {
    nullable: true,
  })
  restInputParamsPropertyName?: string;

  @Field(() => String, {
    nullable: true,
  })
  restInputBodyPropertyName?: string;

  @Field(() => String, {
    nullable: true,
  })
  restInputQueryPropertyName?: string;
}
