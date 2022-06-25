import { EnumResourceType } from '@amplication/prisma-db';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

registerEnumType(EnumResourceType, {
  name: 'EnumResourceType'
});

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
