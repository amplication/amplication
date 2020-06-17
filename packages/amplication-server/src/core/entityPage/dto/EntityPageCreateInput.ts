import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';
import { EnumEntityPageType } from './EnumEntityPageType';
import { EntityPageSingleRecordSettings } from './EntityPageSingleRecordSettings';
import { EntityPageListSettings } from './EntityPageListSettings';
import { JsonValue } from 'type-fest';
import { ValidateIf, IsNotEmpty } from 'class-validator';

@InputType({
  isAbstract: true
})
export class EntityPageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false
  })
  entityId!: string;

  pageType: EnumEntityPageType;

  @ValidateIf(o => o.pageType === EnumEntityPageType.SingleRecord)
  @IsNotEmpty()
  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true
  })
  singleRecordSettings!: (EntityPageSingleRecordSettings | null) & JsonValue;

  @ValidateIf(o => o.pageType === EnumEntityPageType.List)
  @IsNotEmpty()
  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true
  })
  listSettings!: (EntityPageListSettings | null) & JsonValue;
}
