import { InputType } from '@nestjs/graphql';
import { BlockWhereInput } from '../../block/dto/BlockWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCallWhereInput extends BlockWhereInput {}
