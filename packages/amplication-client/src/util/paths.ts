export function commitPath(
  baseProjectPath: string,
  lastCommitId?: string
): string {
  return `${baseProjectPath}/commits/${lastCommitId || ""}`;
}
