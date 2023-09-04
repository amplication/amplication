import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class CreateDefaultRelatedFieldArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => String, { nullable: true })
  relatedFieldName?: string;

  @Field(() => String, { nullable: true })
  relatedFieldDisplayName?: string;

  @Field(() => Boolean, { nullable: true })
  relatedFieldAllowMultipleSelection?: boolean;
}
