import { ArgsType, Field, Int } from "@nestjs/graphql";
import { RoleOrderByInput } from "./RoleOrderByInput";
import { RoleWhereInput } from "./RoleWhereInput";

@ArgsType()
export class RoleFindManyArgs {
  @Field(() => RoleWhereInput, { nullable: true })
  where?: RoleWhereInput;

  @Field(() => RoleOrderByInput, { nullable: true })
  orderBy?: RoleOrderByInput;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
