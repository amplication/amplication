import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ServiceTopicsUpdateInput } from "./ServiceTopicsUpdateInput";

@ArgsType()
export class UpdateServiceTopicsArgs extends UpdateBlockArgs {
  @Field(() => ServiceTopicsUpdateInput, { nullable: false })
  declare data: ServiceTopicsUpdateInput;
}
