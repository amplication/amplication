import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
export class AppSettings {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => String, {
    nullable: false
  })
  dbHost!: string;

  @Field(() => String, {
    nullable: false
  })
  dbName!: string;

  @Field(() => String, {
    nullable: false
  })
  dbUser!: string;

  @Field(() => String, {
    nullable: false
  })
  dbPassword!: string;

  @Field(() => Int, {
    nullable: false
  })
  dbPort!: number;
}
