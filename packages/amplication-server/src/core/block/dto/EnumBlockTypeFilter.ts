import { Field, InputType } from '@nestjs/graphql';
import { EnumBlockType } from 'src/enums/EnumBlockType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumBlockTypeFilter {
  @Field(() => EnumBlockType, {
    nullable: true,
    description: undefined
  })
  equals?: typeof EnumBlockType[keyof typeof EnumBlockType] | null;

  @Field(() => EnumBlockType, {
    nullable: true,
    description: undefined
  })
  not?: typeof EnumBlockType[keyof typeof EnumBlockType] | null;

  @Field(() => [EnumBlockType], {
    nullable: true,
    description: undefined
  })
  in?: typeof EnumBlockType[keyof typeof EnumBlockType][] | null;

  @Field(() => [EnumBlockType], {
    nullable: true,
    description: undefined
  })
  notIn?: typeof EnumBlockType[keyof typeof EnumBlockType][] | null;
}
