import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  moduleDto!: WhereParentIdInput;
}
