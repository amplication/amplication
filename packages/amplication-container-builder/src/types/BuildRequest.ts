export type BuildRequest = {
  /** Desired Docker image tags */
  tags: string[];
  /** Tarball URL context */
  url: string;
  /** Images used for build cache resolution */
  cacheFrom?: string[];
  /** Map of string pairs for build-time variables */
  args?: Record<string, string>;
};
