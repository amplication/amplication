export interface ISecretsManager {
  getSecret: (key: string) => any | null;
}
