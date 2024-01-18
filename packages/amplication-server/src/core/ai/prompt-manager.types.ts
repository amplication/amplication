interface DataModel {
  name: string;
  fields: {
    name: string;
    dataType: string;
  }[];
}

export interface BreakTheMonolithPromptInput {
  dataModels: DataModel[];
}

export interface BreakTheMonolithPromptOutput {
  microservices: {
    name: string;
    functionality: string;
    dataModels: string[];
  }[];
}
