import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IEntityPageSettings } from './IEntityPageSettings';

@ObjectType({
  isAbstract: true,
  description: undefined,
  implements: [IEntityPageSettings]
})
@InputType('EntityPageSingleRecordSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class EntityPageSingleRecordSettings extends IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  allowUpdate!: boolean;
}
