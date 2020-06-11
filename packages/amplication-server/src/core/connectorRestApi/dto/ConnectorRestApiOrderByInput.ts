import { InputType } from '@nestjs/graphql';
import { BlockOrderByInput } from '../../block/dto/BlockOrderByInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiOrderByInput extends BlockOrderByInput {}
