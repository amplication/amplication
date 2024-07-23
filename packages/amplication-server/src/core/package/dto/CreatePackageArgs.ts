import { ArgsType, Field } from "@nestjs/graphql";
import { PackageCreateInput } from "./PackageCreateInput";

@ArgsType()
export class CreatePackageArgs {
  @Field(() => PackageCreateInput, { nullable: false })
  data!: PackageCreateInput;
}
