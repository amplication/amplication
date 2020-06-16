import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityService } from '../entity/entity.service';
import { FindManyEntityPageArgs } from './dto/';
import { EntityPage } from './dto/EntityPage';
import { EnumEntityPagePageType } from './dto/EnumEntityPagePageType';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { CreateSingleRecordEntityPageArgs } from './dto/CreateSingleRecordEntityPageArgs';
import { CreateListEntityPageArgs } from './dto/CreateListEntityPageArgs';
import { ListEntityPage } from './dto/ListEntityPage';
import { SingleRecordEntityPage } from './dto/SingleRecordEntityPage';

@Injectable()
export class EntityPageService extends BlockTypeService<
  EntityPage<any>,
  FindManyEntityPageArgs,
  CreateEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;

  constructor(private readonly entityService: EntityService) {
    super();
  }

  private validateEntityId(args: CreateEntityPageArgs): void {
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
  }

  create(): never {
    throw new Error('Not implemented');
  }

  /** @todo: validate NavigateToPageId */
  async createListEntityPage(
    args: CreateListEntityPageArgs
  ): Promise<ListEntityPage> {
    this.validateEntityId(args);
    if (
      !args.data.settings.showFieldList &&
      !this.entityService.validateAllFieldsExist(
        args.data.entityId,
        args.data.settings.showFieldList
      )
    ) {
      throw new NotFoundException(`Invalid fields selected `);
    }

    return super.create({ ...args, pageType: EnumEntityPagePageType.List });
  }

  async createSingleRecordEntityPage(
    args: CreateSingleRecordEntityPageArgs
  ): Promise<SingleRecordEntityPage> {
    this.validateEntityId(args);
    if (
      !args.data.settings.showFieldList &&
      !this.entityService.validateAllFieldsExist(
        args.data.entityId,
        args.data.settings.showFieldList
      )
    ) {
      throw new NotFoundException(`Invalid fields selected `);
    }

    return super.create({
      ...args,
      pageType: EnumEntityPagePageType.SingleRecord
    });
  }
}
