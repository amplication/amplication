import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';
import { EnumEntityPageType } from './EnumEntityPageType';
import { EntityPageSingleRecordSettings } from './EntityPageSingleRecordSettings';
import { EntityPageListSettings } from './EntityPageListSettings';
import { JsonValue } from 'type-fest';
import { ValidateIf, IsNotEmpty } from 'class-validator';

@InputType({
  isAbstract: true,
})
export class EntityPageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  entityId!: string | null;

  @Field(() => EnumEntityPageType, {
    nullable: false,
  })
  pageType: EnumEntityPageType;

  @ValidateIf((o) => o.pageType === EnumEntityPageType.SingleRecord)
  @IsNotEmpty()
  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true,
  })
  singleRecordSettings?: EntityPageSingleRecordSettings & JsonValue;

  @ValidateIf((o) => o.pageType === EnumEntityPageType.List)
  @IsNotEmpty()
  @Field(() => EntityPageListSettings, {
    nullable: true,
  })
  listSettings?: EntityPageListSettings & JsonValue;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined,
  })
  showAllFields!: boolean;

  @ValidateIf((o) => !o.showAllFields)
  @IsNotEmpty()
  @Field(() => [String], {
    nullable: true,
    description: undefined,
  })
  showFieldList?: string[];
}
