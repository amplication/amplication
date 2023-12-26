import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";
import { ModelChanges } from "./types";

export const CLASS_NAME = "architecture-console";
type TData = {
  resources: models.Resource[];
};

const DATE_CREATED_FIELD = "createdAt";

export default function ArchitectureConsole() {
  const { currentProject } = useContext(AppContext);

  const { loading, error, data, refetch } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },

    fetchPolicy: "no-cache",
  });

  const [createResourceEntities, { error: createEntitiesError }] =
    useMutation<ModelChanges>(CREATE_RESOURCE_ENTITIES, {
      onCompleted: (data) => {
        refetch();
      },
    });

  const handleApplyPlan = useCallback((data: ModelChanges) => {
    data.newServices.forEach((service) => {
      //todo: create new resource
      //update target resourceId in moveEntities list
    });

    createResourceEntities({
      variables: {
        data: {
          entitiesToCopy: data.movedEntities,
          //...data,
        },
      },
    }).catch(console.error);
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

export const CREATE_RESOURCE_ENTITIES = gql`
  mutation copiedEntities($data: ResourcesCreateCopiedEntitiesInput!) {
    copiedEntities(data: $data) {
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
