import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminUISettings {
  @Field(() => Boolean, {
    nullable: false
  })
  generateAdminUI!: boolean;

  @Field(() => String, {
    nullable: false
  })
  adminUIPath!: string;
}
