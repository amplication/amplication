import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeneratedAppDTO {
  @IsNotEmpty()
  @IsString()
  buildId: string;
}
