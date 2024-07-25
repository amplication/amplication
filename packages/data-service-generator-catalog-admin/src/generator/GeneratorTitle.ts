import { Generator as TGenerator } from "../api/generator/Generator";

export const GENERATOR_TITLE_FIELD = "name";

export const GeneratorTitle = (record: TGenerator): string => {
  return record.name?.toString() || String(record.id);
};
