import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BlueprintOrderByInput } from "./BlueprintOrderByInput";
import { BlueprintWhereInput } from "./BlueprintWhereInput";

@ArgsType()
export class BlueprintFindManyArgs {
  @Field(() => BlueprintWhereInput, { nullable: true })
  where?: BlueprintWhereInput;

  @Field(() => BlueprintOrderByInput, { nullable: true })
  orderBy?: BlueprintOrderByInput;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
