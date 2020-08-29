import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { isEmpty } from "lodash";

import { Tooltip } from "@primer/components";

import * as models from "../models";
import "./PendingChangesStatus.scss";

const CLASS_NAME = "pending-changes-status";
const TOOLTIP_DIRECTION = "s";

export type PendingChangeStatusData = {
  pendingChanges: Pick<
    models.PendingChange,
    "resourceId" | "resourceType" | "__typename"
  >[];
};
type Props = {
  applicationId: string;
};

function PendingChangesStatus({ applicationId }: Props) {
  const { data } = useQuery<PendingChangeStatusData>(
    GET_PENDING_CHANGES_STATUS,
    {
      variables: {
        applicationId: applicationId,
      },
    }
  );

  return (
    <div className={CLASS_NAME}>
      <Tooltip
        direction={TOOLTIP_DIRECTION}
        noDelay
        wrap
        aria-label={`pending changes`}
      >
        <NavLink to={`/${applicationId}/pending-changes`}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="published_with_changes"
          />
          {!isEmpty(data?.pendingChanges) && (
            <div className={`${CLASS_NAME}__counter`}>
              {data?.pendingChanges.length}
            </div>
          )}
        </NavLink>
      </Tooltip>
    </div>
  );
}

export default PendingChangesStatus;

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      resourceType
    }
  }
`;
