import { AmplicationError } from 'src/errors/AmplicationError';

export class InvalidColorError extends AmplicationError {
  constructor(color: string) {
    super(`Invalid color: "${color}". Color must be be a valid HTML color hex`);
  }
}
