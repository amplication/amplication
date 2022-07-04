import { Field, InputType, Int } from '@nestjs/graphql';
import { BlockUpdateInput } from '../../block/dto/BlockUpdateInput';
import { AdminUISettingsUpdateInput } from './AdminUISettingsUpdateInput';
import { EnumAuthProviderType } from './EnumAuthenticationProviderType';
import { ServerSettingsUpdateInput } from './ServerSettingsUpdateInput';

@InputType({
  isAbstract: true
})
export class ServiceSettingsUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: false
  })
  dbHost!: string;

  @Field(() => String, {
    nullable: false
  })
  dbName!: string;

  @Field(() => String, {
    nullable: false
  })
  dbUser!: string;

  @Field(() => String, {
    nullable: false
  })
  dbPassword!: string;

  @Field(() => Int, {
    nullable: false
  })
  dbPort!: number;

  @Field(() => EnumAuthProviderType, {
    nullable: false
  })
  authProvider: EnumAuthProviderType;

  @Field(() => AdminUISettingsUpdateInput, {
    nullable: false
  })
  adminUISettings!: AdminUISettingsUpdateInput;

  @Field(() => ServerSettingsUpdateInput, {
    nullable: false
  })
  serverSettings!: ServerSettingsUpdateInput;
}
