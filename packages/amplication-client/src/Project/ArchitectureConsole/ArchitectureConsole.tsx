import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";

import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";

export const CLASS_NAME = "architecture-console";
type TData = {
  resources: models.Resource[];
};

const DATE_CREATED_FIELD = "createdAt";

export default function ArchitectureConsole() {
  const { currentProject } = useContext(AppContext);

  const { loading, error, data } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },

    fetchPolicy: "no-cache",
  });

  const handleApplyPlan = useCallback(() => {
    //todo: send data to the server
    console.log("Apply Plan");
  }, []);

  const errorMessage = error && formatError(error);

  if (loading) return <CircularProgress centerToParent />;
  if (error) return <Snackbar open={Boolean(error)} message={errorMessage} />;

  return (
    <ModelOrganizer resources={data.resources} onApplyPlan={handleApplyPlan} />
  );
}

export const GET_RESOURCES = gql`
  query getResources($projectId: String!) {
    resources(
      where: { project: { id: $projectId }, resourceType: { equals: Service } }
    ) {
      id
      name
      entities {
        id
        displayName
        resourceId
        fields {
          permanentId
          displayName
          description
          properties
          dataType
          customAttributes
          required
          unique
        }
      }
    }
  }
`;
