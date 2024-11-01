import { gql } from "@apollo/client";

export const CUSTOM_PROPERTY_FIELDS_FRAGMENT = gql`
  fragment CustomPropertyFields on CustomProperty {
    id
    name
    description
    key
    enabled
    type
    options {
      value
      color
    }
  }
`;

export const DELETE_CUSTOM_PROPERTY = gql`
  mutation deleteCustomProperty($where: WhereUniqueInput!) {
    deleteCustomProperty(where: $where) {
      id
    }
  }
`;

export const GET_CUSTOM_PROPERTY = gql`
  ${CUSTOM_PROPERTY_FIELDS_FRAGMENT}
  query customProperty($customPropertyId: String!) {
    customProperty(where: { id: $customPropertyId }) {
      ...CustomPropertyFields
    }
  }
`;

export const UPDATE_CUSTOM_PROPERTY = gql`
  ${CUSTOM_PROPERTY_FIELDS_FRAGMENT}
  mutation updateCustomProperty(
    $data: CustomPropertyUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateCustomProperty(data: $data, where: $where) {
      ...CustomPropertyFields
    }
  }
`;

export const CREATE_CUSTOM_PROPERTY = gql`
  ${CUSTOM_PROPERTY_FIELDS_FRAGMENT}
  mutation createCustomProperty($data: CustomPropertyCreateInput!) {
    createCustomProperty(data: $data) {
      ...CustomPropertyFields
    }
  }
`;

export const FIND_CUSTOM_PROPERTIES = gql`
  ${CUSTOM_PROPERTY_FIELDS_FRAGMENT}
  query customProperties(
    $where: CustomPropertyWhereInput
    $orderBy: CustomPropertyOrderByInput
  ) {
    customProperties(where: $where, orderBy: $orderBy) {
      ...CustomPropertyFields
    }
  }
`;
