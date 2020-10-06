/**
 * Configuration format for deployment.
 * Subset of the Terraform JSON Configuration Syntax.
 */
export type Configuration = {
  module: Record<string, { source: string; [key: string]: string }>;
};
