import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { PackageUpdateInput } from "./PackageUpdateInput";

@ArgsType()
export class UpdatePackageArgs extends UpdateBlockArgs {
  @Field(() => PackageUpdateInput, { nullable: false })
  declare data: PackageUpdateInput;
}
