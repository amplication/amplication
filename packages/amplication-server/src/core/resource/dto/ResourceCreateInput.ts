import { EnumResourceType } from '@amplication/prisma-db';
import { Field, InputType } from '@nestjs/graphql';
import { Project } from 'src/models';

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
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => Project, { nullable: true })
  project?: {
    connect: {
      id: string;
    };
  };
}
