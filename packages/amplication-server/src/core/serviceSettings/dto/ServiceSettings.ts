import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { JsonValue } from 'type-fest/source/basic';
import { AdminUISettings } from './AdminUISettings';
import { EnumAuthProviderType } from './EnumAuthenticationProviderType';
import { ServerSettings } from './ServerSettings';

@ObjectType({
  implements: IBlock,
  isAbstract: true
})
export class ServiceSettings extends IBlock {
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
  authProvider!: EnumAuthProviderType;

  @Field(() => AdminUISettings, {
    nullable: false
  })
  adminUISettings: AdminUISettings & JsonValue;

  @Field(() => ServerSettings, {
    nullable: false
  })
  serverSettings: ServerSettings & JsonValue;
}
