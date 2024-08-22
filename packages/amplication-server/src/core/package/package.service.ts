import { Inject, Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePackageArgs } from "./dto/CreatePackageArgs";
import { FindManyPackageArgs } from "./dto/FindManyPackageArgs";
import { Package } from "./dto/Package";
import { UpdatePackageArgs } from "./dto/UpdatePackageArgs";
import { User } from "../../models";
import { ResourceService } from "../resource/resource.service";
import { BlockService } from "../block/block.service";
import { DeletePackageArgs } from "./dto/DeletePackageArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class PackageService extends BlockTypeService<
  Package,
  FindManyPackageArgs,
  CreatePackageArgs,
  UpdatePackageArgs,
  DeletePackageArgs
> {
  blockType = EnumBlockType.Package;

  constructor(
    private resourceService: ResourceService,
    protected readonly blockService: BlockService,
    @Inject(AmplicationLogger) protected readonly logger: AmplicationLogger
  ) {
    super(blockService, logger);
  }
  async create(args: CreatePackageArgs, user: User): Promise<Package> {
    return super.create(args, user);
  }

  async update(args: UpdatePackageArgs, user: User): Promise<Package> {
    // const block = await this.blockService.findOne({
    //   where: args.where,
    // });

    // await this.validateConnectedResource(
    //   block.resourceId,
    //   args.data.messageBrokerId
    // );

    return super.update(args, user);
  }
}
