import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from '../../../models';

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

  @Field(() => String, {
    nullable: false
  })
  npm!: string;
}
