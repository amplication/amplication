/**
 * Configuration format for deployment.
 * Subset of the Terraform JSON Configuration Syntax.
 */
export type Configuration = {
  terraform?: {
    backend?: Record<string, Record<string, string>>;
  };
  module: Record<string, { source: string; [key: string]: string }>;
};
