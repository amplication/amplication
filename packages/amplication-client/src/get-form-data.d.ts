export type Options = {
  includeDisabled: boolean;
  trim: boolean;
};

declare function getFormData(
  form: HTMLFormElement,
  options?: Options
): { [key: string]: boolean | string | string[] };

export default getFormData;
