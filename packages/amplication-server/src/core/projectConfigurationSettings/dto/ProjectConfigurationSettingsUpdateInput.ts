import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class ProjectConfigurationSettingsUpdateInput extends BlockUpdateInput {
  @Field(() => String, { nullable: true })
  baseDirectory?: string | undefined;
}
