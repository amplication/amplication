import { WhereUniqueInput } from "../../../dto";
import { EntityFieldUpdateInput } from "./EntityFieldUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateOneEntityFieldArgs {
  @Field(() => EntityFieldUpdateInput, { nullable: false })
  data!: EntityFieldUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => String, { nullable: true })
  relatedFieldName?: string;

  @Field(() => String, { nullable: true })
  relatedFieldDisplayName?: string;

  @Field(() => Boolean, { nullable: true })
  relatedFieldAllowMultipleSelection?: boolean;
}
