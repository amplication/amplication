import { Field, ObjectType } from "@nestjs/graphql";
import { Build } from "./Build";

@ObjectType({
  isAbstract: true,
})
export class BuildPlugin {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Build, { nullable: true })
  build?: Build;

  @Field(() => String, { nullable: false })
  buildId!: string;

  @Field(() => String, { nullable: false })
  requestedFullPackageName!: string;

  @Field(() => String, { nullable: false })
  packageName!: string;

  @Field(() => String, { nullable: false })
  packageVersion!: string;
}
