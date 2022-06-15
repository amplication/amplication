import { Field, InputType, Int } from '@nestjs/graphql';
import { BlockUpdateInput } from '../../block/dto/BlockUpdateInput';
import { EnumAuthProviderType } from './EnumAuthenticationProviderType';

@InputType({
  isAbstract: true
})
export class AppSettingsUpdateInput extends BlockUpdateInput {
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

  @Field(() => Boolean, {
    nullable: true
  })
  generateAdminUI: boolean;

  @Field(() => Boolean, {
    nullable: true
  })
  generateGraphQL: boolean;

  @Field(() => Boolean, {
    nullable: true
  })
  generateRestApi: boolean;

  @Field(() => Boolean, {
    nullable: true
  })
  generateRootFiles: boolean;
}
