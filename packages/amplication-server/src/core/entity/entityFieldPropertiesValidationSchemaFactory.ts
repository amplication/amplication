import { EnumDataType } from 'src/enums/EnumDataType';

export class EntityFieldPropertiesValidationSchemaFactory {
  static getSchema(dataType: EnumDataType) {
    switch (dataType) {
      case EnumDataType.SingleLineText:
        return {
          $id:
            'https://amplication.com/entityfield.properties.singleLineText.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'singleLineText',
          type: 'object',
          required: ['maxLength'],
          properties: {
            maxLength: {
              type: 'integer',
              description: 'The maximum length of the field',
              minimum: 1
            }
          }
        };
        break;
      case EnumDataType.MultiLineText:
        return {
          $id:
            'https://amplication.com/entityfield.properties.multiLineText.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'multiLineText',
          type: 'object',
          required: ['maxLength'],
          properties: {
            maxLength: {
              type: 'integer',
              description: 'The maximum length of the field',
              minimum: 1
            }
          }
        };
        break;
      case EnumDataType.Email:
        return {
          $id: 'https://amplication.com/entityfield.properties.email.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'email',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.AutoNumber:
        return {
          $id: 'https://amplication.com/entityfield.properties.autoNumber.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'autoNumber',
          type: 'object',
          required: ['seedValue'],
          properties: {
            seedValue: {
              type: 'integer',
              description: '',
              minimum: 1,
              maximum: 9999999
            }
          }
        };
        break;
      case EnumDataType.WholeNumber:
        return {
          $id:
            'https://amplication.com/entityfield.properties.wholeNumber.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'wholeNumber',
          type: 'object',
          required: ['minimumValue', 'maximumValue'],
          properties: {
            minimumValue: {
              type: 'integer',
              description: 'The minimum value',
              minimum: 0,
              maximum: 9999999
            },
            maximumValue: {
              type: 'integer',
              description: 'The maximum value',
              minimum: 0, //todo: reference to minimumValue
              maximum: 9999999
            }
          }
        };
        break;
      case EnumDataType.DateTime:
        return {
          $id: 'https://amplication.com/entityfield.properties.dateTime.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'dateTime',
          type: 'object',
          required: ['timeZone', 'dateOnly'],
          properties: {
            timeZone: {
              type: 'string',
              enum: ['localTime', 'serverTime']
            },
            dateOnly: {
              type: 'boolean'
            }
          }
        };
        break;
      case EnumDataType.DecimalNumber:
        return {
          $id:
            'https://amplication.com/entityfield.properties.decimalNumber.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'decimalNumber',
          type: 'object',
          required: ['minimumValue', 'maximumValue', 'precision'],
          properties: {
            minimumValue: {
              type: 'integer',
              description: 'The minimum value',
              minimum: 0,
              maximum: 9999999
            },
            maximumValue: {
              type: 'integer',
              description: 'The maximum value',
              minimum: 0, //todo: reference to minimumValue
              maximum: 9999999
            },
            precision: {
              type: 'integer',
              description:
                'The number of digits to the right of the decimal point',
              minimum: 0,
              maximum: 8 //todo: Check for the right value
            }
          }
        };
        break;
      case EnumDataType.Lookup:
        return {
          $id: 'https://amplication.com/entityfield.properties.lookup.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'lookup',
          type: 'object',
          required: ['relatedEntityId', 'allowMultipleSelection'],
          properties: {
            relatedEntityId: {
              type: 'string' //todo: validate the actual selected entity
            },
            allowMultipleSelection: {
              type: 'boolean'
            }
          }
        };
        break;
      case EnumDataType.OptionSet:
        return {
          $id: 'https://amplication.com/entityfield.properties.optionSet.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'optionSet',
          type: 'object',
          required: ['optionsSetId'],
          properties: {
            optionsSetId: {
              type: 'string' //todo: validate the actual selected option set
            }
          }
        };
        break;
      case EnumDataType.MultiSelectOptionSet:
        return {
          $id:
            'https://amplication.com/entityfield.properties.multiSelectOptionSet.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'multiSelectOptionSet',
          type: 'object',
          required: ['optionsSetId'],
          properties: {
            optionsSetId: {
              type: 'string' //todo: validate the actual selected option set
            }
          }
        };
        break;
      case EnumDataType.Boolean:
        return {
          $id: 'https://amplication.com/entityfield.properties.boolean.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'boolean',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.Id:
        return {
          $id: 'https://amplication.com/entityfield.properties.id.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'id',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.GeographicAddress:
        return {
          $id:
            'https://amplication.com/entityfield.properties.geographicAddress.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'geographicAddress',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      default:
        break;
    }
  }
}
