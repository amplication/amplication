import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
} from './dto/';

export class ConnectorRestApiService extends BlockTypeService<
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
> {
  blockType = EnumBlockType.ConnectorRestApi;
}
