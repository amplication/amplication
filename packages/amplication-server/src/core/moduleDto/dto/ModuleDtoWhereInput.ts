import { Field, InputType } from "@nestjs/graphql";
import { BlockTypeWhereInput } from "../../block/dto";

@InputType({
  isAbstract: true,
})
export class ModuleDtoWhereInput extends BlockTypeWhereInput {
  @Field(() => Boolean, {
    nullable: true,
  })
  includeCustomDtos?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  includeDefaultDtos?: boolean | null;
}
