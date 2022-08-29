import { registerEnumType } from '@nestjs/graphql';

export enum EnumBlockType {
  ServiceSettings = 'ServiceSettings',
  ProjectConfigurationSettings = 'ProjectConfigurationSettings',
  Flow = 'Flow',
  ConnectorRestApi = 'ConnectorRestApi',
  ConnectorRestApiCall = 'ConnectorRestApiCall',
  ConnectorSoapApi = 'ConnectorSoapApi',
  ConnectorFile = 'ConnectorFile',
  EntityApi = 'EntityApi',
  EntityApiEndpoint = 'EntityApiEndpoint',
  FlowApi = 'FlowApi',
  Layout = 'Layout',
  CanvasPage = 'CanvasPage',
  EntityPage = 'EntityPage',
  Document = 'Document'
}

registerEnumType(EnumBlockType, { name: 'EnumBlockType' });
