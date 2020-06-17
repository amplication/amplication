import { InterfaceType, Field, InputType } from '@nestjs/graphql';
import { ValidateIf, IsNotEmpty } from 'class-validator';

@InterfaceType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class IEntityPageSettings {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  showAllFields!: boolean;

  @ValidateIf(o => !o.showAllFields)
  @IsNotEmpty()
  @Field(() => [String], {
    nullable: true,
    description: undefined
  })
  showFieldList?: string[];
}
