import { EnumBlockType } from '../../enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
} from './dto/';
import { UpdateBlockArgs } from '../block/dto/UpdateBlockArgs';
import { DeleteBlockArgs } from '../block/dto/DeleteBlockArgs';

export class ConnectorRestApiCallService extends BlockTypeService<
  ConnectorRestApiCall,
  FindManyConnectorRestApiCallArgs,
  CreateConnectorRestApiCallArgs,
  UpdateBlockArgs /**@todo: Complete Update Operation */,
  DeleteBlockArgs
> {
  blockType = EnumBlockType.ConnectorRestApiCall;
}
