import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumDataType } from "../../../enums/EnumDataType";

@InputType({
  isAbstract: true,
})
export class EntityFieldCreateByDisplayNameInput {
  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => EnumDataType, {
    nullable: true,
  })
  dataType?: keyof typeof EnumDataType | null;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  entity!: WhereParentIdInput;
}
