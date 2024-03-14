import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories(orderBy: { rank: Asc }) {
      id
      name
      rank
      description
      icon
    }
  }
`;
