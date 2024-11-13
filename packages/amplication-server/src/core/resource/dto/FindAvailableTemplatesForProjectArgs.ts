import { ArgsType, Field, Int } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { ResourceOrderByInput } from "./ResourceOrderByInput";

@ArgsType()
export class FindAvailableTemplatesForProjectArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => [ResourceOrderByInput], { nullable: true })
  orderBy?: ResourceOrderByInput[] | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
