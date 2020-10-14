import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumPanelStyle, Panel, PanelHeader } from "../Components/Panel";

import { GET_ROLES } from "../Roles/RoleList";
import { Button, EnumButtonStyle } from "../Components/Button";
import imageRoles from "../assets/images/tile-roles.svg";
import "./RolesTile.scss";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "roles-tile";

function RolesTile({ applicationId }: Props) {
  const { data, loading } = useQuery<{
    appRoles: models.AppRole[];
  }>(GET_ROLES, {
    variables: {
      id: applicationId,
    },
  });

  return (
    <Panel className={`${CLASS_NAME}`} panelStyle={EnumPanelStyle.Bordered}>
      <PanelHeader className={`${CLASS_NAME}__title`}>
        <h2>Roles</h2>
      </PanelHeader>

      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          {loading ? (
            <CircularProgress />
          ) : !data?.appRoles.length ? (
            <>There are no roles</>
          ) : (
            <>
              You have {data?.appRoles.length}
              {data?.appRoles.length > 1 ? " roles" : " role"}
            </>
          )}
        </div>
        <img src={imageRoles} alt="roles" />
        <Link
          to={`/${applicationId}/roles`}
          className={`${CLASS_NAME}__content__action`}
        >
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            eventData={{
              eventName: "rolesTileClick",
            }}
          >
            Create Roles
          </Button>
        </Link>
      </div>
    </Panel>
  );
}

export default RolesTile;
