import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from '../../../models';
import { EnumEntityPageType } from './EnumEntityPageType';
import { EntityPageSingleRecordSettings, EntityPageListSettings } from '.';
import { JsonValue } from 'type-fest';
import { ValidateIf, IsNotEmpty } from 'class-validator';

@ObjectType({
  isAbstract: true,
  implements: [IBlock]
})
export class EntityPage extends IBlock {
  @Field(() => String, {
    nullable: false
  })
  entityId!: string;

  @Field(() => EnumEntityPageType, {
    nullable: false
  })
  pageType: EnumEntityPageType;

  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true
  })
  singleRecordSettings?: EntityPageSingleRecordSettings & JsonValue;

  @Field(() => EntityPageListSettings, {
    nullable: true
  })
  listSettings?: EntityPageListSettings & JsonValue;

  @Field(() => Boolean, {
    nullable: false
  })
  showAllFields!: boolean;

  @ValidateIf(o => !o.showAllFields)
  @IsNotEmpty()
  @Field(() => [String], {
    nullable: true
  })
  showFieldList?: string[];
}
