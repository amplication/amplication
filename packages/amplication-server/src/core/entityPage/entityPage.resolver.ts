import { Resolver } from '@nestjs/graphql';
import { EntityPageService } from './entityPage.service';
import {
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs
} from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';

@Resolver(() => EntityPage)
export class EntityPageResolver extends BlockTypeResolver(
  EntityPage,
  'EntityPages',
  FindManyEntityPageArgs,
  'createEntityPage',
  CreateEntityPageArgs
) {
  constructor(private readonly service: EntityPageService) {
    super();
  }
}
