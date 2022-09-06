import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true
})
export class PluginInstallationCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false
  })
  enabled: boolean;

  order: number; //This field is set by the service, do not expose to the API
}
