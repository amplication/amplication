import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { EnumModuleActionGqlOperation } from "./EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./EnumModuleActionRestVerb";

@InputType({
  isAbstract: true,
})
export class ModuleActionCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

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
}
