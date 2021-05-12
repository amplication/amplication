import {
  IntrospectionSchema,
  IntrospectionType,
  IntrospectionField,
} from "graphql";

export type {
  IntrospectionInputObjectType,
  IntrospectionType,
  IntrospectionField,
} from "graphql";

export type IntrospectionResults = {
  types: IntrospectionType[];
  queries: IntrospectionField[];
  resources: [
    {
      type: IntrospectionType;
      GET_LIST: IntrospectionField | undefined;
      GET_MANY: IntrospectionField | undefined;
      GET_MANY_REFERENCE: IntrospectionField | undefined;
      GET_ONE: IntrospectionField | undefined;
      CREATE: IntrospectionField | undefined;
      UPDATE: IntrospectionField | undefined;
      DELETE: IntrospectionField | undefined;
      UPDATE_MANY: IntrospectionField | undefined;
      DELETE_MANY: IntrospectionField | undefined;
    }
  ];
  schema: IntrospectionSchema;
};
