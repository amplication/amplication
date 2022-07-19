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
`
