import type { Octokit } from "@octokit/core";
import {
  Changes,
  File,
  TreeParameter,
  UpdateFunctionFile,
} from "octokit-plugin-create-pull-request/dist-types/types";

export async function createTree(
  octokit: Octokit,
  owner: string,
  repo: string,
  latestCommitSha: string,
  latestCommitTreeSha: string,
  changes: Required<Changes["files"]>
): Promise<string | null> {
  const tree = (
    await Promise.all(
      Object.keys(changes).map(async (path) => {
        const value = changes[path];

        if (value === null) {
          // Deleting a non-existent file from a tree leads to an "GitRPC::BadObjectState" error,
          // so we only attempt to delete the file if it exists.
          try {
            // https://developer.github.com/v3/repos/contents/#get-contents
            await octokit.request("HEAD /repos/{owner}/{repo}/contents/:path", {
              owner,
              repo,
              ref: latestCommitSha,
              path,
            });

            return {
              path,
              mode: "100644",
              sha: null,
            };
          } catch (error) {
            return;
          }
        }

        // When passed a function, retrieve the content of the file, pass it
        // to the function, then return the result
        if (typeof value === "function") {
          let result;

          try {
            const { data: file } = await octokit.request(
              "GET /repos/{owner}/{repo}/contents/:path",
              {
                owner,
                repo,
                ref: latestCommitSha,
                path,
              }
            );

            result = await value(
              Object.assign(file, { exists: true }) as UpdateFunctionFile
            );
          } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // istanbul ignore if
            if (error.status !== 404) throw error;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result = await value({ exists: false });
          }

          if (result === null || typeof result === "undefined") return;
          return valueToTreeObject(octokit, owner, repo, path, result);
        }

        return valueToTreeObject(octokit, owner, repo, path, value);
      })
    )
  ).filter(Boolean) as TreeParameter;

  if (tree.length === 0) {
    return null;
  }

  // https://developer.github.com/v3/git/trees/#create-a-tree
  const {
    data: { sha: newTreeSha },
  } = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner,
    repo,
    base_tree: latestCommitTreeSha,
    tree,
  });

  return newTreeSha;
}

export async function valueToTreeObject(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  value: string | File
) {
  let mode = "100644";
  if (value !== null && typeof value !== "string") {
    mode = value.mode || mode;
  }

  // Text files can be changed through the .content key
  if (typeof value === "string") {
    return {
      path,
      mode: mode,
      content: value,
    };
  }

  // Binary files need to be created first using the git blob API,
  // then changed by referencing in the .sha key
  const { data } = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner,
      repo,
      ...value,
    }
  );
  const blobSha = data.sha;

  return {
    path,
    mode: mode,
    sha: blobSha,
  };
}
