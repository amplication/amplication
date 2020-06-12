import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  EntityPage,
  CreateEntityPageArgs,
  FindManyEntityPageArgs
} from './dto/';

export class EntityPageService extends BlockTypeService<
  EntityPage,
  CreateEntityPageArgs,
  FindManyEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;
}
