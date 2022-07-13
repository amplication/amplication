import { Entity, ResourceRole } from 'src/models';
import { AppInfo } from './AppInfo';


export interface BuildContextData {
    entities: Entity[],
    roles: ResourceRole[],
    appInfo: AppInfo
}