import { ArgsType, Field } from '@nestjs/graphql';
import { ResourceCreateWithEntitiesInput } from './ResourceCreateWithEntitiesInput';

@ArgsType()
export class CreateResourceWithEntitiesArgs {
  @Field(() => ResourceCreateWithEntitiesInput, { nullable: false })
  data!: ResourceCreateWithEntitiesInput;
}
