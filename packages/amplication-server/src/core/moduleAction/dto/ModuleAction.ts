import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumModuleActionType } from "./EnumModuleActionType";
import { EnumModuleActionGqlOperation } from "./EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./EnumModuleActionRestVerb";
import { PropertyTypeDef } from "../../moduleDto/dto/propertyTypes/PropertyTypeDef";
import { EnumModuleActionRestInputSource } from "./EnumModuleActionRestInputSource";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class ModuleAction extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => EnumModuleActionType, {
    nullable: false,
  })
  actionType!: keyof typeof EnumModuleActionType;

  @Field(() => String, {
    nullable: true,
  })
  fieldPermanentId?: string;

  @Field(() => EnumModuleActionGqlOperation, {
    nullable: false,
  })
  gqlOperation!: keyof typeof EnumModuleActionGqlOperation;

  @Field(() => EnumModuleActionRestVerb, {
    nullable: false,
  })
  restVerb!: keyof typeof EnumModuleActionRestVerb;

  @Field(() => String, {
    nullable: true,
  })
  path!: string;

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
