import { Resolver } from "@nestjs/graphql";
import { PackageService } from "./package.service";
import { FindManyPackageArgs } from "./dto/FindManyPackageArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { Package } from "./dto/Package";
import { CreatePackageArgs } from "./dto/CreatePackageArgs";
import { UpdatePackageArgs } from "./dto/UpdatePackageArgs";
import { DeletePackageArgs } from "./dto/DeletePackageArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => Package)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class PackageResolver extends BlockTypeResolver(
  Package,
  "packageList",
  FindManyPackageArgs,
  "createPackage",
  CreatePackageArgs,
  "updatePackage",
  UpdatePackageArgs,
  "deletePackage",
  DeletePackageArgs
) {
  constructor(private readonly service: PackageService) {
    super();
  }
}
