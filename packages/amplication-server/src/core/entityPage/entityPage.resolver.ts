import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { EntityPageService } from './entityPage.service';
import { FindManyEntityPageArgs } from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { EntityPage } from './dto/EntityPage';
import { SingleRecordEntityPage } from './dto/SingleRecordEntityPage';
import { CreateSingleRecordEntityPageArgs } from './dto/CreateSingleRecordEntityPageArgs';
import { CreateListEntityPageArgs } from './dto/CreateListEntityPageArgs';
import { ListEntityPage } from './dto/ListEntityPage';

@Resolver(() => EntityPage)
export class EntityPageResolver extends BlockTypeResolver(
  EntityPage,
  'EntityPages',
  FindManyEntityPageArgs
) {
  constructor(private readonly service: EntityPageService) {
    super();
  }

  @Mutation(() => SingleRecordEntityPage, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createSingleRecordEntityPage(
    @Args() args: CreateSingleRecordEntityPageArgs
  ): Promise<SingleRecordEntityPage> {
    return this.service.createSingleRecordEntityPage(args);
  }

  @Mutation(() => ListEntityPage, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createListEntityPage(
    @Args() args: CreateListEntityPageArgs
  ): Promise<ListEntityPage> {
    return this.service.createListEntityPage(args);
  }
}
