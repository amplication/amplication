import { Field, InputType } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class ModuleCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  @Matches(/^[a-zA-Z0-9._-]+$/)
  name!: string | null;

  @Field(() => String, {
    nullable: true,
  })
  entityId?: string;
}
