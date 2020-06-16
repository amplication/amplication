import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityPage } from './dto/EntityPage';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { FindManyEntityPageArgs } from './dto/FindManyEntityPageArgs';

export class EntityPageService extends BlockTypeService<
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;
}
