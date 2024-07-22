import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumPackageStatus } from "../enums/EnumPackageStatus";
import { PackageFile } from "./PackageFile";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class Package extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  summary!: string;

  @Field(() => EnumPackageStatus, {
    nullable: false,
  })
  status: keyof typeof EnumPackageStatus;

  @Field(() => [PackageFile], {
    nullable: true,
  })
  files?: PackageFile[];

  @Field(() => String, {
    nullable: false,
  })
  originalFileChecksum!: string;

  @Field(() => Date, {
    nullable: true,
  })
  lastGeneratedAt?: Date;

  @Field(() => String, {
    nullable: true,
  })
  packageGenerationLogs?: string;
}
