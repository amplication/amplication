import { Field, InputType } from '@nestjs/graphql';
import { AccountUserWhereInput } from './AccountUserWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AccountUserFilter {
  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: AccountUserWhereInput | null;

  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: AccountUserWhereInput | null;

  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: AccountUserWhereInput | null;
}
