import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  isAbstract: true,
  implements: [IBlock]
})
export class PluginInstallation extends IBlock {
  @Field(() => String, {
    nullable: false
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false
  })
  enabled!: boolean;

  @Field(() => Int, {
    nullable: false
  })
  order!: number;
}
