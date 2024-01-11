import { WhereParentIdInput } from "../../../dto";
import { EnumDataType } from "../../../enums/EnumDataType";
import { Field, InputType } from "@nestjs/graphql";

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
