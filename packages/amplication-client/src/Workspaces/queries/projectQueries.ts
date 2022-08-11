import { gql } from "@apollo/client";

export const GET_CURRENT_PROJECT = gql`
  query findProject($projectId: String!) {
    project(where: { id: $projectId }) {
      id
      name
      resources {
        id
      }
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query findProjects {
    projects {
      id
      name
      resources {
        id
        name
      }
      createdAt
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation createProject($data: ProjectCreateInput) {
    createProject(data: $data) {
      id
      name
    }
  }
`;
// temporary demand by resource until API will be ready
export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($projectId: String!) {
    pendingChanges(where: { project: { id: $projectId } }) {
      resource {
        id
        name
        resourceType
      }
    }
  }
`;
