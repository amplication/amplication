import { ArgsType, Field } from "@nestjs/graphql";
import { BlueprintRelationUpsertInput } from "./BlueprintRelationUpsertInput";
import { WhereBlueprintUniqueInput } from "./WhereBlueprintRelationUniqueInput";

@ArgsType()
export class UpsertBlueprintRelationArgs {
  @Field(() => WhereBlueprintUniqueInput, { nullable: false })
  where!: WhereBlueprintUniqueInput;

  @Field(() => BlueprintRelationUpsertInput, { nullable: false })
  data: BlueprintRelationUpsertInput;
}
