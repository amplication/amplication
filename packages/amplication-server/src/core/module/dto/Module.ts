import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

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
