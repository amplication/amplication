import { gql } from "@apollo/client";
import { CUSTOM_PROPERTY_FIELDS_FRAGMENT } from "../../CustomProperties/queries/customPropertiesQueries";

export const BLUEPRINT_RELATION_FIELDS_FRAGMENT = gql`
  fragment BlueprintRelationFields on BlueprintRelation {
    name
    key
    description
    relatedTo
    allowMultiple
    required
  }
`;

export const BLUEPRINT_FIELDS_FRAGMENT = gql`
  ${CUSTOM_PROPERTY_FIELDS_FRAGMENT}
  ${BLUEPRINT_RELATION_FIELDS_FRAGMENT}
  fragment BlueprintFields on Blueprint {
    id
    name
    description
    key
    enabled
    color
    properties {
      ...CustomPropertyFields
    }
    relations {
      ...BlueprintRelationFields
    }
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

export const UPSERT_BLUEPRINT_RELATION = gql`
  ${BLUEPRINT_RELATION_FIELDS_FRAGMENT}
  mutation upsertBlueprintRelation(
    $data: BlueprintRelationUpsertInput!
    $where: WhereBlueprintRelationUniqueInput!
  ) {
    upsertBlueprintRelation(data: $data, where: $where) {
      ...BlueprintRelationFields
    }
  }
`;

export const DELETE_BLUEPRINT_RELATION = gql`
  ${BLUEPRINT_RELATION_FIELDS_FRAGMENT}
  mutation deleteBlueprintRelation($where: WhereBlueprintRelationUniqueInput!) {
    deleteBlueprintRelation(where: $where) {
      ...BlueprintRelationFields
    }
  }
`;
