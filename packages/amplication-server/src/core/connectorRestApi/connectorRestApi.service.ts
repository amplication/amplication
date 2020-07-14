import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
} from './dto/';
import { UpdateBlockArgs } from '../block/dto/UpdateBlockArgs';

export class ConnectorRestApiService extends BlockTypeService<
  ConnectorRestApi,
  FindManyConnectorRestApiArgs,
  CreateConnectorRestApiArgs,
  UpdateBlockArgs /**@todo: Complete Update Operation */
> {
  blockType = EnumBlockType.ConnectorRestApi;
}
