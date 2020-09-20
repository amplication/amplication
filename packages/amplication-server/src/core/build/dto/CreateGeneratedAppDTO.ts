import { IsNotEmpty, IsString } from 'class-validator';
import { JsonObject, JsonValue } from 'type-fest';

export class CreateGeneratedAppDTO implements JsonObject {
  [key: string]: JsonValue;
  @IsNotEmpty()
  @IsString()
  buildId: string;
}
