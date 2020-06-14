import { Field, InputType } from '@nestjs/graphql';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumDataTypeFilter {
  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumDataType | null;

  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumDataType | null;

  @Field(() => [EnumDataType], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumDataType | null>;

  @Field(() => [EnumDataType], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof EnumDataType | null>;
}
