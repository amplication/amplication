import { gql } from "@apollo/client";

export const BLUEPRINT_FIELDS_FRAGMENT = gql`
  fragment BlueprintFields on Blueprint {
    id
    name
    description
    key
    enabled
    color
  }
`;

export const DELETE_BLUEPRINT = gql`
  mutation deleteBlueprint($where: WhereUniqueInput!) {
    deleteBlueprint(where: $where) {
      id
    }
  }
`;

export const GET_BLUEPRINT = gql`
  ${BLUEPRINT_FIELDS_FRAGMENT}
  query blueprint($blueprintId: String!) {
    blueprint(where: { id: $blueprintId }) {
      ...BlueprintFields
    }
  }
`;

export const UPDATE_BLUEPRINT = gql`
  ${BLUEPRINT_FIELDS_FRAGMENT}
  mutation updateBlueprint(
    $data: BlueprintUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateBlueprint(data: $data, where: $where) {
      ...BlueprintFields
    }
  }
`;

export const CREATE_BLUEPRINT = gql`
  ${BLUEPRINT_FIELDS_FRAGMENT}
  mutation createBlueprint($data: BlueprintCreateInput!) {
    createBlueprint(data: $data) {
      ...BlueprintFields
    }
  }
`;

export const FIND_BLUEPRINTS = gql`
  ${BLUEPRINT_FIELDS_FRAGMENT}
  query blueprints(
    $where: BlueprintWhereInput
    $orderBy: BlueprintOrderByInput
  ) {
    blueprints(where: $where, orderBy: $orderBy) {
      ...BlueprintFields
    }
  }
`;

export const GET_BLUEPRINTS_MAP = gql`
  ${BLUEPRINT_FIELDS_FRAGMENT}
  query blueprints(
    $where: BlueprintWhereInput
    $orderBy: BlueprintOrderByInput
  ) {
    blueprints(where: $where, orderBy: $orderBy) {
      ...BlueprintFields
    }
  }
`;
