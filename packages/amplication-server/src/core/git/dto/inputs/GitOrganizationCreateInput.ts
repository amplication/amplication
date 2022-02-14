import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class GitOrganizationCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => Number, {
    nullable: false
  })
  installationId!: number;

  @Field(() => String, {
    nullable: false
  })
  code: string;
}
