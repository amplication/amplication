import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumPackageStatus } from "../enums/EnumPackageStatus";

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
}
