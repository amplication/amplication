import { InputType } from '@nestjs/graphql';
import { BlockTypeWhereInput } from '../../block/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiWhereInput extends BlockTypeWhereInput {}
