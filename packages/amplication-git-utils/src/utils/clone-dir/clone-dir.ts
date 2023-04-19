import { join, normalize } from "path";
import { v4 } from "uuid";
import { MissingEnvParam } from "../../errors/MissingEnvParam";
import { EnumGitProvider } from "../../types";

interface CloneDirParams {
  owner: string;
  repositoryName: string;
  provider: EnumGitProvider;
  suffix?: string;
}

export const CLONES_FOLDER_ENV = "CLONES_FOLDER";

export function getCloneDir({
  owner,
  repositoryName,
  provider,
  suffix,
}: CloneDirParams) {
  const cloneFolder = process.env.CLONES_FOLDER;

  if (!cloneFolder) {
    throw new MissingEnvParam(CLONES_FOLDER_ENV);
  }

  const cloneDir = normalize(
    join(cloneFolder, provider, owner, repositoryName, suffix || "")
  );

  return cloneDir;
}
