import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PluginOrderItem {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Int, {
    nullable: false,
  })
  order!: number;
}
