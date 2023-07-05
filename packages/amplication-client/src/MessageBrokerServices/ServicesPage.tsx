import React from "react";
import { useQuery } from "@apollo/client";
import { HorizontalRule } from "@amplication/ui/design-system";
import { EnumResourceType, Resource } from "../models";
import { GET_MESSAGE_BROKER_CONNECTED_SERVICES } from "../Workspaces/queries/resourcesQueries";
import PageContent from "../Layout/PageContent";
import { useRouteMatch } from "react-router-dom";
import "./ServicesPage.scss";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
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
    <PageContent pageTitle={pageTitle} className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <div className={`${CLASS_NAME}__header__top`}>
          <ResourceCircleBadge type={EnumResourceType.Service} />
          <div className={`${CLASS_NAME}__header__top__title`}>
            Service List
          </div>
        </div>
        <div className={`${CLASS_NAME}__header__description`}>
          Services associated with this message broker.
        </div>
      </div>
      <HorizontalRule />
      <div className={`${CLASS_NAME}__list`}>
        {data?.messageBrokerConnectedServices.map((service) => (
          <Item
            key={service.id}
            service={service}
            link={`/${workspaceId}/${projectId}/${service.id}`}
          />
        ))}
      </div>
    </PageContent>
  );
};

export default Service;
