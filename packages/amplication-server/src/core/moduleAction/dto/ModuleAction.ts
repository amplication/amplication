import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumModuleActionType } from "./EnumModuleActionType";

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
}
