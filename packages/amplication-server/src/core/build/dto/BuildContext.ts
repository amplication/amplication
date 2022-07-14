import { BuildContextData } from './BuildContextData';

export interface BuildContext {
  buildId: string;
  resourceId: string;
  projectId: string;
  data: BuildContextData;
}
