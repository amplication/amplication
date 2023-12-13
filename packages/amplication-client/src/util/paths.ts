export function commitPath(
  currentWorkspaceId: string,
  currentProjectId: string,
  lastCommitId?: string
): string {
  return `/${currentWorkspaceId}/${currentProjectId}/commits/${
    lastCommitId || ""
  }`;
}
