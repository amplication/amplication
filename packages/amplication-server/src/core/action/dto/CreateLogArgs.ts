import { EnumActionLogLevel } from './EnumActionLogLevel';
import { JsonValue } from 'type-fest';

export class CreateLogArgs {
  stepId: string;
  message: string;
  meta: JsonValue;
  level: EnumActionLogLevel;
}
