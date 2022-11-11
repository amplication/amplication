import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IEntityPageSettings } from './IEntityPageSettings';

@ObjectType({
  isAbstract: true,
  implements: [IEntityPageSettings]
})
@InputType('EntityPageSingleRecordSettingsInput', {
  isAbstract: true
})
export class EntityPageSingleRecordSettings extends IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false
  })
  allowUpdate!: boolean;
}
