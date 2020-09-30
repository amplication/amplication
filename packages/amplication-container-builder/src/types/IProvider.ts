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
   */
  build(repository: string, tag: string, url: string): Promise<BuildResult>;
}
