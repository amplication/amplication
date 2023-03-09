import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class LinksMetadata {
  @Field(() => String, { nullable: false })
  href: string;

  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType({
  isAbstract: true,
})
export class GitUserLinks {
  @Field(() => LinksMetadata, { nullable: false })
  avatar: LinksMetadata;
}
