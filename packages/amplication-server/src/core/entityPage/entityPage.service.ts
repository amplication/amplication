import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityService } from '../entity/entity.service';
import { FindManyEntityPageArgs, EnumEntityPagePageType } from './dto/';
import { EntityPage } from './dto/EntityPage';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';

@Injectable()
export class EntityPageService extends BlockTypeService<
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;

  constructor(private readonly entityService: EntityService) {
    super();
  }

  async create(args: CreateEntityPageArgs): Promise<EntityPage> {
    if (
      !this.entityService.isPersistentEntityInSameApp(
        args.data.entityId,
        args.data.app.connect.id
      )
    ) {
      throw new NotFoundException(
        `Can't find persistent entity with ID ${args.data.EntityId}`
      );
    }

    /* Validate that the correct setting object is provided based on the page type  */
    /* Validate that all the provided fields exists in the selected entity */
    switch (args.data.PageType) {
      case EnumEntityPagePageType.List:
        if (!args.data.ListSettings) {
          throw new ConflictException(`Invalid Settings`);
        }

        /**@todo: validate NavigateToPageId */

        if (
          !args.data.listSettings.showFieldList &&
          !this.entityService.validateAllFieldsExist(
            args.data.entityId,
            args.data.listSettings.showFieldList
          )
        ) {
          throw new NotFoundException(`Invalid fields selected `);
        }
        break;

      case EnumEntityPagePageType.SingleRecord:
        if (!args.data.SingleRecordSettings) {
          throw new ConflictException(`Invalid Settings`);
        }

        if (
          !args.data.singleRecordSettings.showFieldList &&
          !this.entityService.validateAllFieldsExist(
            args.data.entityId,
            args.data.singleRecordSettings.showFieldList
          )
        ) {
          throw new NotFoundException(`Invalid fields selected `);
        }
        break;
    }

    return super.create(args);
  }
}
