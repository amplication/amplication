import { BuildResult } from "./BuildResult";

/**
 * Provides an interface for building containers
 */
export interface IProvider {
  /**
   * Builds docker image from given URL context and tags it within given
   * repository and with given tag
   * @param repository desired Docker image repository
   * @param tag desired Docker image tag
   * @param url tarball URL context
   * @param buildArgs map of string pairs for build-time variables
   */
  build(
    repository: string,
    tag: string,
    url: string,
    buildArgs: Record<string, string>
  ): Promise<BuildResult>;

  /**
   * Gets the status of the docker build process for the statusQuery returned from the provider in the build() action
   * @param statusQuery Provider specific query to be used to find the requested build
   */
  getStatus(statusQuery: any): Promise<BuildResult>;
}
