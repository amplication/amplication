import { registerEnumType } from '@nestjs/graphql';

export enum EnumBlockType {
  appSettings = 'appSettings',
  flow = 'flow',
  ConnectorRestApi = 'ConnectorRestApi',
  ConnectorRestApiCall = 'ConnectorRestApiCall',
  ConnectorSoapApi = 'ConnectorSoapApi',
  ConnectorFile = 'ConnectorFile',
  entityApi = 'entityApi',
  entityApiEndpoint = 'entityApiEndpoint',
  flowApi = 'flowApi',
  layout = 'layout',
  canvasPage = 'canvasPage',
  wizardPage = 'wizardPage',
  document = 'document'
}

registerEnumType(EnumBlockType, {
  name: 'EnumBlockType',
  description: undefined
});
