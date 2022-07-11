import { ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  implements: IBlock,
  isAbstract: true
})
export class ProjectConfigurationSettings extends IBlock {}
