import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('EntityPageListSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class EntityPageListSettings {
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

  /* When True, all fields of the entity will be shown in the page. New fields on the entity will be added automatically to the page  */
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  showAllFields!: boolean;

  /* The list of fields of the entity to show in the page in case "ShowAllFields" is false  */
  @Field(() => [String], {
    nullable: true,
    description: undefined
  })
  showFieldList?: string[];
}
