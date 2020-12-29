import { BuildRequest } from "./BuildRequest";
import { BuildResult } from "./BuildResult";

/**
 * Provides an interface for building containers
 */
export interface IProvider {
  /**
   * Builds docker image from given URL context and tags it within given
   * repository and with given tag
   * @param request parameters for building the container
   */
  build(request: BuildRequest): Promise<BuildResult>;
  /**
   * Gets the status of the docker build process for the statusQuery returned from the provider in the build() action
   * @param statusQuery Provider specific query to be used to find the requested build
   */
  getStatus(statusQuery: any): Promise<BuildResult>;
  /**
   * Creates an image ID for the given tag
   */
  createImageId(tag: string): string;
}
