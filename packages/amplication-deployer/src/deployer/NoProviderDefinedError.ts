export class NoProviderDefinedError extends Error {
  constructor() {
    super(
      "No provider defined. Either the providerName argument must be provided or the default option provider to be defined"
    );
  }
}
