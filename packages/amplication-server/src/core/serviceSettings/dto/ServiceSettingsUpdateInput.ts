import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { AdminUISettingsUpdateInput } from "./AdminUISettingsUpdateInput";
import { EnumAuthProviderType } from "./EnumAuthenticationProviderType";
import { ServerSettingsUpdateInput } from "./ServerSettingsUpdateInput";

@InputType({
  isAbstract: true,
})
export class ServiceSettingsUpdateInput extends BlockUpdateInput {
  @Field(() => EnumAuthProviderType, {
    nullable: false,
  })
  authProvider: EnumAuthProviderType;

  @Field(() => AdminUISettingsUpdateInput, {
    nullable: false,
  })
  adminUISettings!: AdminUISettingsUpdateInput;

  @Field(() => ServerSettingsUpdateInput, {
    nullable: false,
  })
  serverSettings!: ServerSettingsUpdateInput;

  @Field(() => String, {
    nullable: true,
  })
  authEntityName?: string;
}
