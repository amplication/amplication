import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";
import { Build } from "../core/build/dto/Build";
import { PendingChange } from "../core/resource/dto/PendingChange";
import { Project } from "./Project";

@ObjectType({
  isAbstract: true,
})
export class Commit {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  project?: Project;

  @Field(() => String, {
    nullable: false,
  })
  userId!: string;

  @Field(() => User, {
    nullable: true,
  })
  user?: User;

  @Field(() => String, {
    nullable: false,
  })
  message!: string;

  @Field(() => [Build], {
    nullable: true,
  })
  builds?: Build[] | null;

  @Field(() => [PendingChange], {
    nullable: true,
  })
  changes?: PendingChange[] | null;
}
