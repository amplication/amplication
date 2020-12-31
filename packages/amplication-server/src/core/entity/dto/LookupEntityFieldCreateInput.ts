import { Field, InputType, Int } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';
import { LookupPropertiesInput } from './LookupPropertiesInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class LookupEntityFieldCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => LookupPropertiesInput, {
    nullable: false,
    description: undefined
  })
  properties!: LookupPropertiesInput;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  required!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  searchable!: boolean;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  position?: number | null;
}
