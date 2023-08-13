import { AmplicationError } from "../../../errors/AmplicationError";

export class ProjectConfigurationExistError extends AmplicationError {
  constructor() {
    super("Project Configuration already exists");
  }
}
