import React from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Resource } from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resourceId: string;
  currentProjectId: string;
  currentWorkspaceId: string;
  enabled: boolean;
  connectionResource: Resource;
};

const CLASS_NAME = "service-connections-list__list__item";

export default function ServiceConnectionsListItem({
  resourceId,
  currentProjectId,
  currentWorkspaceId,
  enabled,
  connectionResource,
}: Props) {
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  return (
    <div key={connectionResource.id} className={`${CLASS_NAME}`}>
      <InnerTabLink
        to={`${baseUrl}/service-connections/${connectionResource.id}`}
      >
        <span className={`${CLASS_NAME}__name`}>{connectionResource.name}</span>
        <svg height="8" width="8">
          <circle
            cx="4"
            cy="4"
            r="3"
            fill={enabled ? "var(--theme-green)" : "var( --theme-light-red)"}
          />
        </svg>
      </InnerTabLink>
    </div>
  );
}
