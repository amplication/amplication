import { Field, InputType, Int } from '@nestjs/graphql';
import { AppCreateInput } from './AppCreateInput';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true
})
export class AppCreateWithEntitiesFieldInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType | null;
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

  @Field(() => [Int], {
    nullable: true
  })
  relationsToEntityIndex?: number[] | null;
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
