import { Field, InputType } from '@nestjs/graphql';
import { AppCreateInput } from './AppCreateInput';

@InputType({
  isAbstract: true
})
export class AppCreateWithEntitiesFieldInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;
}

@InputType({
  isAbstract: true
})
export class AppCreateWithEntitiesEntityInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => [AppCreateWithEntitiesFieldInput], {
    nullable: false
  })
  fields!: AppCreateWithEntitiesFieldInput[];
}

@InputType({
  isAbstract: true
})
export class AppCreateWithEntitiesInput {
  @Field(() => AppCreateInput, {
    nullable: false
  })
  app!: AppCreateInput;

  @Field(() => [AppCreateWithEntitiesEntityInput], {
    nullable: false
  })
  entities!: AppCreateWithEntitiesEntityInput[];

  @Field(() => String, {
    nullable: false
  })
  commitMessage!: string;
}
