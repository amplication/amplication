import { rm } from "fs/promises";
import { join } from "path";
import { simpleGit, SimpleGit } from "simple-git";
import tempDir from "temp-dir";
import { v4 } from "uuid";
import { EnumGitProvider } from "../types";
import { GitProvidersUrlMap } from "./git-providers-url-map";

export interface RepositoryCloneArgs {
  provider: EnumGitProvider;
  owner: string;
  repo: string;
}

async function clearRepositoryClone(dir: string) {
  await rm(dir, { recursive: true });
}

const folderRemoval = new FinalizationRegistry(clearRepositoryClone);

export class GitClient {
  git: SimpleGit;
  private cloneDir: string;
  private cloneUrl: string;
  private isInit = false;

  constructor({ provider, owner, repo }: RepositoryCloneArgs) {
    const protocol = "https://";
    const cloneUrl = `${protocol}${GitProvidersUrlMap[provider]}/${owner}/${repo}.git`;

    const cloneDir = join(tempDir, provider, owner, repo, v4());
    this.cloneDir = cloneDir;

    this.cloneUrl = cloneUrl;
    folderRemoval.register(this, this.cloneDir);

    console.log(`Cloned ${cloneUrl} to ${cloneDir}`);
  }

  public async init(): Promise<void> {
    if (this.isInit) {
      return;
    }
    try {
      await clearRepositoryClone(this.cloneDir);
    } catch (error) {
      /* empty */
    }
    this.git = simpleGit();
    await this.git.clone(this.cloneUrl, this.cloneDir, ["--no-checkout"]);
    await this.git.cwd(this.cloneDir);
    this.isInit = true;
    return;
  }
}
