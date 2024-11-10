import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class ProjectUpdateInput {
  //we do not expose the name property to the client, because the project name is updated via the project Configuration resource
  name?: string | undefined;

  @Field(() => Boolean, { nullable: true })
  platformIsPublic?: boolean | undefined;
}
