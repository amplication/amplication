import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
} from './dto/';
import { UpdateBlockArgs } from '../block/dto/UpdateBlockArgs';

export class ConnectorRestApiCallService extends BlockTypeService<
  ConnectorRestApiCall,
  FindManyConnectorRestApiCallArgs,
  CreateConnectorRestApiCallArgs,
  UpdateBlockArgs
> {
  blockType = EnumBlockType.ConnectorRestApiCall;
}
