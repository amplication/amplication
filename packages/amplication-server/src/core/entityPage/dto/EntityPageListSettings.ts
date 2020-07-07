import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IEntityPageSettings } from './IEntityPageSettings';

@ObjectType({
  isAbstract: true,
  implements: IEntityPageSettings,
  description: undefined
})
@InputType('EntityPageListSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class EntityPageListSettings extends IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  enableSearch!: boolean;

  /* The page to navigate to when a user clicks on a single row */
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  navigateToPageId!: string;
}
