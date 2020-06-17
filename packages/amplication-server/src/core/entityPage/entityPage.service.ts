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

  private async validateEntityInApp(
    entityId: string,
    appId: string
  ): Promise<void> {
    if (!this.entityService.isPersistentEntityInSameApp(entityId, appId)) {
      throw new NotFoundException(
        `Can't find persistent entity with ID ${entityId} in ${appId}`
      );
    }
  }

  private async validateEntityFieldNames(
    entityId: string,
    fieldNames: string[]
  ): Promise<void> {
    const nonMatchingNames = await this.entityService.validateAllFieldsExist(
      entityId,
      fieldNames
    );
    throw new NotFoundException(
      `Invalid fields selected: ${Array.from(nonMatchingNames).join(', ')}`
    );
  }

  create(): never {
    throw new Error('Not implemented');
  }

  /** @todo: validate NavigateToPageId */
  async createListEntityPage(
    args: CreateListEntityPageArgs
  ): Promise<ListEntityPage> {
    this.validateEntityInApp(args.data.entityId, args.data.app.connect.id);

    if (args.data.settings.showFieldList) {
      await this.validateEntityFieldNames(
        args.data.entityId,
        args.data.settings.showFieldList
      );
    }

    return super.create({
      ...args,
      data: { ...args.data, pageType: EnumEntityPagePageType.List }
    });
  }

  async createSingleRecordEntityPage(
    args: CreateSingleRecordEntityPageArgs
  ): Promise<SingleRecordEntityPage> {
    this.validateEntityInApp(args.data.entityId, args.data.app.connect.id);

    if (args.data.settings.showFieldList) {
      await this.validateEntityFieldNames(
        args.data.entityId,
        args.data.settings.showFieldList
      );
    }

    return super.create({
      ...args,
      data: { ...args.data, pageType: EnumEntityPagePageType.SingleRecord }
    });
  }
}
