import { EnumResourceType } from '@amplication/prisma-db';
import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class ResourceCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  @Field(() => String, {
    nullable: true
  })
  color?: string;

  @Field(() => EnumResourceType, { nullable: false })
  type!: keyof typeof EnumResourceType;

  workspace?: {
    connect: {
      id: string;
    };
  };
}
