import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  implements: IBlock,
  isAbstract: true,
  description: undefined
})
export class AppSettings extends IBlock {
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
