import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class GitUserLinks {
  @Field(() => String, { nullable: false })
  avatar!: Avatar;
}

@ObjectType({
  isAbstract: true,
})
export class Avatar {
  @Field(() => String, { nullable: false })
  href!: string;

  @Field(() => String, { nullable: false })
  name!: string;
}
