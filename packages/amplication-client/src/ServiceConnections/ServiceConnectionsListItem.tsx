import React, { useMemo } from "react";
import InnerTabLink from "../Layout/InnerTabLink";
import { Resource } from "../models";

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
  const circle = useMemo(() => {
    return (
      <svg height="8" width="8">
        <circle
          cx="4"
          cy="4"
          r="3"
          fill={enabled ? "var(--positive-default)" : "var(--negative-light)"}
        />
      </svg>
    );
  }, [enabled]);
  return (
    <div key={connectionResource.id} className={`${CLASS_NAME}`}>
      <InnerTabLink
        to={`/${currentWorkspaceId}/${currentProjectId}/${resourceId}/service-connections/${connectionResource.id}`}
      >
        <div className={`${CLASS_NAME}__inner`}>
          <span>{connectionResource.name}</span>
          {circle}
        </div>
      </InnerTabLink>
    </div>
  );
}
