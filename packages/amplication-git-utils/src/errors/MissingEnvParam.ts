export class MissingEnvParam extends Error {
  constructor(param: string) {
    super(`Missing environment parameter: ${param}`);
  }
}
