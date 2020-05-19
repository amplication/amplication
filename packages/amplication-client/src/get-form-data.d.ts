declare module "get-form-data" {
  export type Options = {
    includeDisabled: boolean;
    trim: boolean;
  };

  export default function getFormData(
    form: HTMLFormElement,
    options?: Options
  ): { [key: string]: boolean | string | string[] };
}
