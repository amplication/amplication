import { EnumDataType } from 'src/enums/EnumDataType';

export class entityFieldPropertiesValidationSchemaFactory {
  static getSchema(dataType: EnumDataType) {
    switch (dataType) {
      case EnumDataType.singleLineText:
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
      case EnumDataType.multiLineText:
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
      case EnumDataType.email:
        return {
          $id: 'https://amplication.com/entityfield.properties.email.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'email',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.state:
        return {
          $id: 'https://amplication.com/entityfield.properties.state.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'state',
          type: 'object',
          required: ['states'],
          properties: {
            states: {
              type: 'array',
              items: {
                type: 'string' //todo: check if each is unique
              }
            }
          }
        };
        break;
      case EnumDataType.autoNumber:
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
      case EnumDataType.wholeNumber:
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
      case EnumDataType.dateTime:
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
      case EnumDataType.decimalNumber:
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
      case EnumDataType.file:
        return {
          $id: 'https://amplication.com/entityfield.properties.file.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'file',
          type: 'object',
          required: ['maxfileSize', 'allowedExtensions'],
          properties: {
            maxfileSize: {
              type: 'integer',
              description: 'The maximum file size in KB',
              minimum: 0,
              maximum: 9999999 //todo: move to system settings
            },
            allowedExtensions: {
              type: 'array',
              items: {
                type: 'string' //todo: add limited set in system settings and use "enum"
              }
            }
          }
        };
        break;
      case EnumDataType.image:
        return {
          $id: 'https://amplication.com/entityfield.properties.image.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'image',
          type: 'object',
          required: ['maxfileSize'],
          properties: {
            maxfileSize: {
              type: 'integer',
              description: 'The maximum file size in KB',
              minimum: 0,
              maximum: 9999999 //todo: move to system settings
            }
          }
        };
        break;
      case EnumDataType.lookup:
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
      case EnumDataType.optionSet:
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
      case EnumDataType.multiSelectOptionSet:
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
      case EnumDataType.twoOptions:
        return {
          $id: 'https://amplication.com/entityfield.properties.twoOptions.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'twoOptions',
          type: 'object',
          required: ['option1', 'option2', 'default'],
          properties: {
            option1: {
              type: 'string'
            },
            option2: {
              type: 'string'
            },
            default: {
              type: 'string' //validate one of the above
            }
          }
        };
        break;
      case EnumDataType.boolean:
        return {
          $id: 'https://amplication.com/entityfield.properties.boolean.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'boolean',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.uniqueId:
        return {
          $id: 'https://amplication.com/entityfield.properties.uniqueId.json',
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'uniqueId',
          type: 'object',
          required: [],
          properties: {}
        };
        break;
      case EnumDataType.geographicAddress:
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
