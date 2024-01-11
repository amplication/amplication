export interface PromptManagerGeneratePromptForBreakTheMonolithArgs {
  resourceName: string;
  resourceDisplayName: string;
  entities: {
    name: string;
    displayName: string;
    fields: {
      name: string;
      displayName: string;
      dataType: string;
    }[];
  }[];
}
