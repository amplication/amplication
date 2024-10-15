export function formatGitignorePaths(ignoredPaths: string[]): string {
  const ignoredPathsWithoutDuplicates = ignoredPaths.filter((item, index) => {
    // Ignore empty lines in .gitignore for better readability
    if (item === " ") return item;
    return ignoredPaths.indexOf(item) === index;
  });

  // Add new line at the end of the file for better github restrictions
  return ignoredPathsWithoutDuplicates.join("\n") + "\n";
}
