import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';
import { JsonValue } from 'type-fest';
import {
  EnumEntityPagePageType,
  EntityPageSingleRecordSettings,
  EntityPageListSettings
} from './';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityPageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  entityId!: string;

  @Field(() => EnumEntityPagePageType, {
    nullable: false,
    description: undefined
  })
  pageType!: keyof typeof EnumEntityPagePageType;

  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true,
    description: undefined
  })
  singleRecordSettings?: EntityPageSingleRecordSettings & JsonValue;

  @Field(() => EntityPageListSettings, {
    nullable: true,
    description: undefined
  })
  listSettings?: EntityPageListSettings & JsonValue;
}
