import { ServiceSettingsValues } from 'src/core/serviceSettings/constants';

export class ServiceInfo {
  name: string;
  description: string;
  version: string;
  id: string;
  url: string;
  settings: ServiceSettingsValues;
}
