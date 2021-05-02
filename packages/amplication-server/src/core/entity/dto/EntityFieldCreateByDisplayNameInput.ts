import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldCreateByDisplayNameInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType | null;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;
}
