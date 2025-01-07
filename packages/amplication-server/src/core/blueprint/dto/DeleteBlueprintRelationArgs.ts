import { ArgsType, Field } from "@nestjs/graphql";
import { WhereBlueprintRelationUniqueInput } from "./WhereBlueprintRelationUniqueInput";

@ArgsType()
export class DeleteBlueprintRelationArgs {
  @Field(() => WhereBlueprintRelationUniqueInput, { nullable: false })
  where!: WhereBlueprintRelationUniqueInput;
}
