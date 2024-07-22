import { Field, InputType } from "@nestjs/graphql";
//import type { JsonValue } from "type-fest";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PackageFile } from "./PackageFile";
import { EnumPackageStatus } from "../enums/EnumPackageStatus";

@InputType({
  isAbstract: true,
})
export class PackageUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  summary?: string;

  @Field(() => [PackageFile], {
    //todo: check validations
    nullable: true,
  })
  files?: PackageFile[];

  @Field(() => EnumPackageStatus, {
    nullable: true,
  })
  packageStatus?: EnumPackageStatus;
}
