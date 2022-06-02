import { IGitProvider } from './gitProvider.interface';
import { GitProviderEnum } from '../enums/gitProvider.enum';

export interface IGitHostProviderFactory {
  getHostProvider: (provider: GitProviderEnum) => IGitProvider;
}
