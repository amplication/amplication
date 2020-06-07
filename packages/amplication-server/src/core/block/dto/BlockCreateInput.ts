import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockInputOutput } from 'src/models';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BlockCreateInput<T> {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;

  blockType!: keyof typeof EnumBlockType;

  settings: T;

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  inputParameters?: BlockInputOutput[];

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  outputParameters?: BlockInputOutput[];
}
