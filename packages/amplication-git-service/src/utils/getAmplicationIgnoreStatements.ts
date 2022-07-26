import { IGitClient } from '../contracts/IGitClient';
import { AMPLICATION_IGNORE_FILE_NAME } from './constants';

export const getAmplicationIgnoreStatements = async (
  gitClient: IGitClient,
  userName: string,
  repoName: string,
  baseBranchName: string,
  installationId: string
): Promise<string[]> => {
  let amplicationIgnoreStatements = [];

  try {
    const amplicationignore = await gitClient.getFile(
      userName,
      repoName,
      AMPLICATION_IGNORE_FILE_NAME,
      baseBranchName,
      installationId
    );
    amplicationIgnoreStatements = amplicationignore.content.split('\n') || [];
  } catch (error) {
    console.log("Repository don't have an .amplicationignore file");
  }

  return amplicationIgnoreStatements;
};
