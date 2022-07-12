import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  implements: IBlock,
  isAbstract: true
})
export class ProjectConfigurationSettings extends IBlock {
  @Field(() => String, { nullable: false })
  baseDirectory!: string;
}
