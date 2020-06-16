import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import {
  EnumEntityPagePageType,
  EntityPageSingleRecordSettings,
  EntityPageListSettings
} from './';

@ObjectType({
  implements: IBlock,
  isAbstract: true,
  description: undefined
})
export class EntityPage extends IBlock {
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
  singleRecordSettings?: EntityPageSingleRecordSettings;

  @Field(() => EntityPageListSettings, {
    nullable: true,
    description: undefined
  })
  listSettings?: EntityPageListSettings;
}
