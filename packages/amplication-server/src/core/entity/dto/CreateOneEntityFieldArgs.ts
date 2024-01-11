import { EntityFieldCreateInput } from "./EntityFieldCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(() => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;

  @Field(() => String, { nullable: true })
  relatedFieldName?: string;

  @Field(() => String, { nullable: true })
  relatedFieldDisplayName?: string;

  @Field(() => Boolean, { nullable: true })
  relatedFieldAllowMultipleSelection?: boolean;
}
