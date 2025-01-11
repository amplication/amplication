import { Field, InputType } from "@nestjs/graphql";
//import type { JsonValue } from "type-fest";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class PackageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  summary!: string;
}
