import { EnumDataType } from '../../enums/EnumDataType';

export class entityFieldPropertiesValidationSchemaFactory {
  static getSchema(dataType: EnumDataType) {
    switch (dataType) {
      case EnumDataType.singleLineText:
        return {
          $id: 'https://amplication.com/entityfield.properties.singleLineText.json',
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
      case EnumDataType.wholeNumber:
        return {
          $id: 'https://amplication.com/entityfield.properties.wholeNumber.json',
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
      default:
        break;
    }
  }
}
