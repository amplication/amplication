import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { FindOneWithVersionArgs } from 'src/dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

interface IBlockTypeService<T, FindManyArgs, CreateArgs> {
  findOne(args: FindOneWithVersionArgs): Promise<T | null>;
  findMany(args: FindManyArgs): Promise<T[]>;
  create(args: CreateArgs): Promise<T>;
}

type Constructor<T> = {
  new (...args: any): T;
};

export function BlockTypeResolver<T extends IBlock, FindManyArgs, CreateArgs>(
  classRef: Constructor<T>,
  findManyName: string,
  findManyArgsRef: Constructor<FindManyArgs>,
  createName: string,
  createArgsRef: Constructor<CreateArgs>
): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    service: IBlockTypeService<T, FindManyArgs, CreateArgs>;

    @Query(() => classRef, {
      name: classRef.name,
      nullable: true,
      description: undefined
    })
    @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.id')
    async findOne(@Args() args: FindOneWithVersionArgs): Promise<T | null> {
      return this.service.findOne(args);
    }

    @Query(() => [classRef], {
      name: findManyName,
      nullable: false,
      description: undefined
    })
    @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
    async findMany(
      @Args({ type: () => findManyArgsRef }) args: FindManyArgs
    ): Promise<T[]> {
      return this.service.findMany(args);
    }

    @Mutation(() => classRef, {
      name: createName,
      nullable: false,
      description: undefined
    })
    @AuthorizeContext(
      AuthorizableResourceParameter.AppId,
      'data.app.connect.id'
    )
    async [createName](
      @Args({ type: () => createArgsRef }) args: CreateArgs
    ): Promise<T> {
      return this.service.create(args);
    }
  }
  return BaseResolverHost;
}
