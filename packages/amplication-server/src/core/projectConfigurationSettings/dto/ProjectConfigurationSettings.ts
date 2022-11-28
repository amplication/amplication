import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

@ObjectType({
  implements: IBlock,
  isAbstract: true,
})
export class ProjectConfigurationSettings extends IBlock {
  @Field(() => String, { nullable: false })
  baseDirectory!: string;
}
