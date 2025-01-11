import { ArgsType, Field } from "@nestjs/graphql";
import { BlueprintRelationUpsertInput } from "./BlueprintRelationUpsertInput";
import { WhereBlueprintRelationUniqueInput } from "./WhereBlueprintRelationUniqueInput";

@ArgsType()
export class UpsertBlueprintRelationArgs {
  @Field(() => WhereBlueprintRelationUniqueInput, { nullable: false })
  where!: WhereBlueprintRelationUniqueInput;

  @Field(() => BlueprintRelationUpsertInput, { nullable: false })
  data: BlueprintRelationUpsertInput;
}
