import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class EntityAddPermissionFieldInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => String, {
    nullable: false
  })
  fieldName: string;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  entity!: WhereParentIdInput;
}
