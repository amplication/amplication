import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumModuleDtoType } from "./EnumModuleDtoType";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class ModuleDto extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => EnumModuleDtoType, {
    nullable: false,
  })
  dtoType!: keyof typeof EnumModuleDtoType;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  relatedEntityId?: string;
}
