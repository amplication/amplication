import { Resolver } from '@nestjs/graphql';
import { EntityPageService } from './entityPage.service';
import { FindManyEntityPageArgs } from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { EntityPage } from './dto/EntityPage';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { UpdateEntityPageArgs } from './dto/UpdateEntityPageArgs';

@Resolver(() => EntityPage)
export class EntityPageResolver extends BlockTypeResolver(
  EntityPage,
  'EntityPages',
  FindManyEntityPageArgs,
  'createEntityPage',
  CreateEntityPageArgs,
  'updateEntityPage',
  UpdateEntityPageArgs
) {
  constructor(private readonly service: EntityPageService) {
    super();
  }
}
