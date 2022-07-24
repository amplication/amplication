import { Entity, ResourceRole } from 'src/models';
import { ServiceInfo } from './AppInfo';

export interface BuildContextData {
  entities: Entity[];
  roles: ResourceRole[];
  serviceInfo: ServiceInfo;
}
