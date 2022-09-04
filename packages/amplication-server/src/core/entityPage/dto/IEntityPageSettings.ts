import { InterfaceType, Field, InputType } from '@nestjs/graphql';

@InterfaceType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false
  })
  allowCreation!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  allowDeletion!: boolean;
}
