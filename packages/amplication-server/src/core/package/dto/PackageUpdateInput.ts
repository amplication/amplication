import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { EnumPackageStatus } from "../enums/EnumPackageStatus";

@InputType({
  isAbstract: true,
})
export class PackageUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  summary?: string;

  @Field(() => EnumPackageStatus, {
    nullable: true,
  })
  packageStatus?: EnumPackageStatus;
}
