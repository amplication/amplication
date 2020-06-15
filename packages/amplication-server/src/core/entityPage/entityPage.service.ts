import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import {
  EntityPage,
  CreateEntityPageArgs,
  FindManyEntityPageArgs
} from './dto/';

export class EntityPageService extends BlockTypeService<
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;

  async create(args: CreateEntityPageArgs): Promise<EntityPage> {
    /** @todo: complete validations/*
    
    /*validate that the selected entity ID exist in the current app and it is a persistent entity */

    /* Validate that the correct setting object is provided based on the page type  */

    /* Validate that all the provided fields exists */

    return super.create(args);
  }
}
 