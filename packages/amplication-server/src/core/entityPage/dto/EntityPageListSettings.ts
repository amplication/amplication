import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IEntityPageSettings } from './IEntityPageSettings';

@ObjectType({
  isAbstract: true,
  implements: IEntityPageSettings
})
@InputType('EntityPageListSettingsInput', {
  isAbstract: true
})
export class EntityPageListSettings extends IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false
  })
  enableSearch!: boolean;

  /* The page to navigate to when a user clicks on a single row */
  @Field(() => String, {
    nullable: true
  })
  navigateToPageId!: string;
}
