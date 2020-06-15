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
  EntityId!: string;

  @Field(() => EnumEntityPagePageType, {
    nullable: false,
    description: undefined
  })
  PageType!: keyof typeof EnumEntityPagePageType;

  @Field(() => EntityPageSingleRecordSettings, {
    nullable: false,
    description: undefined
  })
  ListSettings: EntityPageSingleRecordSettings;

  @Field(() => EntityPageListSettings, {
    nullable: false,
    description: undefined
  })
  SingleRecordSettings: EntityPageListSettings;
}
