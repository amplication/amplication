import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityService } from '../entity/entity.service';
import { FindManyEntityPageArgs } from './dto/';
import { EntityPage } from './dto/EntityPage';
import { EnumEntityPageType } from './dto/EnumEntityPageType';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { UpdateEntityPageArgs } from './dto/UpdateEntityPageArgs';
import { User } from 'src/models';

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

  private async validateEntityInResource(
    entityId: string,
    resourceId: string
  ): Promise<void> {
    if (!this.entityService.isEntityInSameResource(entityId, resourceId)) {
      throw new NotFoundException(
        `Can't find persistent entity with ID ${entityId} in ${resourceId}`
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

  async create(args: CreateEntityPageArgs, user: User): Promise<EntityPage> {
    await Promise.all([
      this.validateEntityInResource(
        args.data.entityId,
        args.data.resource.connect.id
      ),
      this.validatePageType(
        args.data.pageType,
        args.data.entityId,
        args.data.showAllFields,
        args.data.showFieldList
      )
    ]);

    return super.create(args, user);
  }

  async update(args: UpdateEntityPageArgs, user: User): Promise<EntityPage> {
    await this.validatePageType(
      args.data.pageType,
      args.data.entityId,
      args.data.showAllFields,
      args.data.showFieldList
    );

    return super.update(args, user);
  }
}
