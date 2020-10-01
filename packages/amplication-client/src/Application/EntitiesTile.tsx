import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumPanelStyle, Panel, PanelHeader } from "../Components/Panel";

import { GET_ENTITIES } from "../Entity/EntityList";
import { Button, EnumButtonStyle } from "../Components/Button";
import imageEntities from "../assets/images/tile-entities.svg";
import "./EntitiesTile.scss";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "entities-tile";

function EntitiesTile({ applicationId }: Props) {
  const { data, loading } = useQuery<{
    entities: models.Entity[];
  }>(GET_ENTITIES, {
    variables: {
      id: applicationId,
    },
  });

  return (
    <Panel className={`${CLASS_NAME}`} panelStyle={EnumPanelStyle.Bordered}>
      <PanelHeader className={`${CLASS_NAME}__title`}>
        <h2>Entities</h2>
      </PanelHeader>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={`${CLASS_NAME}__content`}>
          <div className={`${CLASS_NAME}__content__details`}>
            {!data?.entities.length ? (
              <>There are no entities</>
            ) : (
              <>
                You have {data?.entities.length}
                {data?.entities.length > 1 ? " entities" : " entity"}
              </>
            )}
          </div>
          <img src={imageEntities} alt="entities" />
          <Link
            to={`/${applicationId}/entities`}
            className={`${CLASS_NAME}__content__action`}
          >
            <Button buttonStyle={EnumButtonStyle.Secondary}>
              View All Entities
            </Button>
          </Link>
        </div>
      )}
    </Panel>
  );
}

export default EntitiesTile;
