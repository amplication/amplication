export enum ResourceBasedAuthParamType {
  OrganizationId = 'OrganizationId',
  AppId = 'AppId'
}

export class ResourceBasedAuthParams {
  param!: string;
  type: ResourceBasedAuthParamType;
  applyFromContext?: boolean = false;
}
