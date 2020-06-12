import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
} from './dto/';

export class ConnectorRestApiCallService extends BlockTypeService<
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
> {
  blockType = EnumBlockType.ConnectorRestApiCall;
}
