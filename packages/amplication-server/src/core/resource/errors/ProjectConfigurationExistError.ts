import { AmplicationError } from 'src/errors/AmplicationError';

export class ProjectConfigurationExistError extends AmplicationError {
  constructor() {
    super('Project Configuration already exists');
  }
}
