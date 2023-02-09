/* eslint-disable @typescript-eslint/naming-convention */

export interface NpmVersion {
  [versionNumber: string]: {
    version: string;
    name: string;
    description: string;
    dist: {
      tarball: string;
    };
    deprecated: string;
  };
}

export interface NpmPackage {
  name: string;
  "dist-tags": { latest: string };
  versions: NpmVersion;
}
