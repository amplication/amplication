import { Field, InputType } from '@nestjs/graphql';
import { BlockUpdateInput } from 'src/core/block/dto/BlockUpdateInput';

@InputType({ isAbstract: true })
export class ProjectConfigurationSettingsUpdateInput extends BlockUpdateInput {
  @Field(() => String, { nullable: true })
  baseDirectory?: string | undefined;
}
