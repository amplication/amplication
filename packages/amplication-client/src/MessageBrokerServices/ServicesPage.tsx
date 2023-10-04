import { HorizontalRule, List } from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { useRouteMatch } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { GET_MESSAGE_BROKER_CONNECTED_SERVICES } from "../Workspaces/queries/resourcesQueries";
import { Resource } from "../models";
import { Item } from "./Item";

type Response = {
  messageBrokerConnectedServices: Resource[];
};

const CLASS_NAME = "services-page";

const pageTitle = "Services";

const Service = () => {
  const match = useRouteMatch<{
    workspaceId: string;
    projectId: string;
    resourceId: string;
  }>("/:workspaceId/:projectId/:resourceId/services");

  const { workspaceId, projectId, resourceId } = match?.params ?? {};

  const getResourceVars = { variables: { where: { id: resourceId } } };
  const { data } = useQuery<Response>(
    GET_MESSAGE_BROKER_CONNECTED_SERVICES,
    getResourceVars
  );

  return (
    <PageContent
      pageTitle={pageTitle}
      className={CLASS_NAME}
      contentTitle="Connected service List"
      contentSubTitle="Services connected with this message broker."
    >
      <HorizontalRule />
      <List>
        {data?.messageBrokerConnectedServices.map((service) => (
          <Item
            key={service.id}
            service={service}
            link={`/${workspaceId}/${projectId}/${service.id}`}
          />
        ))}
      </List>
    </PageContent>
  );
};

export default Service;
