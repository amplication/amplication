import { ArgsType, Field } from '@nestjs/graphql';
import { ResourceCreateWithEntitiesInput } from './AppCreateWithEntitiesInput';

@ArgsType()
export class CreateAppWithEntitiesArgs {
  @Field(() => ResourceCreateWithEntitiesInput, { nullable: false })
  data!: ResourceCreateWithEntitiesInput;
}
