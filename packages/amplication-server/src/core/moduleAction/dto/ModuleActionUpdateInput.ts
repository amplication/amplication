import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { EnumModuleActionGqlOperation } from "./EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./EnumModuleActionRestVerb";

@InputType({
  isAbstract: true,
})
export class ModuleActionUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

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
