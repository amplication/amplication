import { IBlock } from "../../../models";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class Module extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  entityId?: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;
}
