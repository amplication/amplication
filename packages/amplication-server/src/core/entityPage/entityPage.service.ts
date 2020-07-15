import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityService } from '../entity/entity.service';
import { FindManyEntityPageArgs } from './dto/';
import { EntityPage } from './dto/EntityPage';
import { EnumEntityPageType } from './dto/EnumEntityPageType';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { UpdateEntityPageArgs } from './dto/UpdateEntityPageArgs';

@Injectable()
export class EntityPageService extends BlockTypeService<
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs,
  UpdateEntityPageArgs
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
    showAllFields: boolean,
    showFieldList: string[]
  ): Promise<void> {
    if (showAllFields) {
      return;
    }
    const nonMatchingNames = await this.entityService.validateAllFieldsExist(
      entityId,
      showFieldList
    );
    if (nonMatchingNames.size > 0) {
      throw new NotFoundException(
        `Invalid fields selected: ${Array.from(nonMatchingNames).join(', ')}`
      );
    }
  }

  private async validatePageType(
    pageType: EnumEntityPageType,
    entityId: string,
    showAllFields: boolean,
    showFieldList: string[]
  ) {
    await this.validateEntityFieldNames(entityId, showAllFields, showFieldList);

    /** @todo: case EnumEntityPageType.List validate navigateToPageId */
  }

  async create(args: CreateEntityPageArgs): Promise<EntityPage> {
    await Promise.all([
      this.validateEntityInApp(args.data.entityId, args.data.app.connect.id),
      this.validatePageType(
        args.data.pageType,
        args.data.entityId,
        args.data.showAllFields,
        args.data.showFieldList
      )
    ]);

    return super.create(args);
  }

  async update(args: UpdateEntityPageArgs): Promise<EntityPage> {
    await this.validatePageType(
      args.data.pageType,
      args.data.entityId,
      args.data.showAllFields,
      args.data.showFieldList
    );

    return super.update(args);
  }
}
