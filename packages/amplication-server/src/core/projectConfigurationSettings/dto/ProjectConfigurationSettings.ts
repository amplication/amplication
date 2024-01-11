import { IBlock } from "../../../models";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  implements: IBlock,
  isAbstract: true,
})
export class ProjectConfigurationSettings extends IBlock {
  @Field(() => String, { nullable: false })
  baseDirectory!: string;
}
