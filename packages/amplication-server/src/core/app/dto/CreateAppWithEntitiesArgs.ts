import { ArgsType, Field } from '@nestjs/graphql';
import { AppCreateWithEntitiesInput } from './AppCreateWithEntitiesInput';

@ArgsType()
export class CreateAppWithEntitiesArgs {
  @Field(() => AppCreateWithEntitiesInput, { nullable: false })
  data!: AppCreateWithEntitiesInput;
}
