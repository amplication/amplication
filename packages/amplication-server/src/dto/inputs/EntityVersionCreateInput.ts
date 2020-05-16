import { Field, InputType, Int } from '@nestjs/graphql';
//import { EntityCreateOneWithoutEntityVersionsInput } from "../inputs/EntityCreateOneWithoutEntityVersionsInput";
import { WhereParentIdInput } from './WhereParentIdInput';
import { EntityFieldConnectInput } from '../inputs/EntityFieldConnectInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionCreateInput {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  label!: string;

  @Field(_type => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  //entity!: Entity;
  entity!: WhereParentIdInput;

  @Field(_type => EntityFieldConnectInput, {
    nullable: true,
    description: undefined
  })
  entityFields?: EntityFieldConnectInput | null;
}
