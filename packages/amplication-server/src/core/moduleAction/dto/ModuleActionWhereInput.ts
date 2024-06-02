import { Field, InputType } from "@nestjs/graphql";
import { BlockTypeWhereInput } from "../../block/dto";

@InputType({
  isAbstract: true,
})
export class ModuleActionWhereInput extends BlockTypeWhereInput {
  @Field(() => Boolean, {
    nullable: true,
  })
  includeCustomActions?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  includeDefaultActions?: boolean | null;
}
