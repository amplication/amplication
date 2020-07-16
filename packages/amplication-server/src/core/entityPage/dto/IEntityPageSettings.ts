import { InterfaceType, Field, InputType } from '@nestjs/graphql';

@InterfaceType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  allowCreation!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  allowDeletion!: boolean;
}
