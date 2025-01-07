import { gql } from "@apollo/client";

export const RELATION_FIELDS_FRAGMENT = gql`
  fragment RelationFields on Relation {
    id
    relationKey
    relatedResources
  }
`;

export const GET_RESOURCE_RELATIONS = gql`
  ${RELATION_FIELDS_FRAGMENT}
  query relations($resourceId: String!) {
    relations(where: { resource: { id: $resourceId } }) {
      ...RelationFields
    }
  }
`;

export const UPDATE_RESOURCE_RELATION = gql`
  ${RELATION_FIELDS_FRAGMENT}
  mutation updateResourceRelation(
    $data: ResourceRelationUpdateInput!
    $resourceId: String!
  ) {
    updateResourceRelation(data: $data, resource: { id: $resourceId }) {
      ...RelationFields
    }
  }
`;
