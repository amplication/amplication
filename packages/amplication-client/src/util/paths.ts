export function commitPath(
  currentWorkspaceId: string,
  currentProjectId: string,
  lastCommitId?: string
) {
  return `/${currentWorkspaceId}/${currentProjectId}/commits/${
    lastCommitId || ""
  }`;
}
