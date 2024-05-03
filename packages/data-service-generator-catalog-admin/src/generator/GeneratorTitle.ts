import { Generator as TGenerator } from "../api/generator/Generator";

export const GENERATOR_TITLE_FIELD = "fullName";

export const GeneratorTitle = (record: TGenerator): string => {
  return record.fullName?.toString() || String(record.id);
};
