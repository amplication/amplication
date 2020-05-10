export enum ResourceBasedAuthParamType {
  OrganizationId = 'OrganizationId',
  ProjectId = 'ProjectId'
}

export class ResourceBasedAuthParams {
  param!: string;
  type: ResourceBasedAuthParamType;
  applyFromContext?: boolean = false;
}
