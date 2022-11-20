import { AmplicationError } from "../../../errors/AmplicationError";

export class ProjectConfigurationSettingsExistError extends AmplicationError {
  constructor() {
    super("Project Configuration Settings already exists");
  }
}
