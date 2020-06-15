import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityPageSingleRecordSettings {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  AllowCreation!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  AllowDeletion!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  AllowUpdate!: boolean;

  /* When True, all fields of the entity will be shown in the page. New fields on the entity will be added automatically to the page  */
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  ShowAllFields!: boolean;

  /* The list of fields of the entity to show in the page in case "ShowAllFields" is false  */
  @Field(() => [String], {
    nullable: true,
    description: undefined
  })
  ShowFieldList!: string[];
}
