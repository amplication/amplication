import { IsNotEmpty, IsString } from 'class-validator';
import { JsonObject, JsonValue } from 'type-fest';

export class CreateDeploymentDTO implements JsonObject {
  [key: string]: JsonValue;
  @IsNotEmpty()
  @IsString()
  deploymentId: string;
}
