import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumPanelStyle, Panel, PanelHeader } from "../Components/Panel";

import { GET_LAST_BUILD } from "../VersionControl/LastBuild";
import "./CurrentBuildTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import publishImage from "../assets/images/tile-publish.svg";
import UserAndTime from "../Components/UserAndTime";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "current-build-tile";

function CurrentBuildTile({ applicationId }: Props) {
  const { data, loading } = useQuery<{
    builds: models.Build[];
  }>(GET_LAST_BUILD, {
    variables: {
      appId: applicationId,
    },
  });

  const lastBuild = useMemo(() => {
    if (loading) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <Panel className={`${CLASS_NAME}`} panelStyle={EnumPanelStyle.Bordered}>
      <PanelHeader className={`${CLASS_NAME}__title`}>
        <h2>
          Current Build
          {lastBuild && (
            <span className="version-number">{lastBuild?.version}</span>
          )}
        </h2>
      </PanelHeader>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={`${CLASS_NAME}__content`}>
          <div className={`${CLASS_NAME}__content__details`}>
            {!lastBuild ? (
              <>There are no builds yet</>
            ) : (
              <UserAndTime
                account={lastBuild?.createdBy?.account || {}}
                time={lastBuild?.createdAt}
              />
            )}
          </div>
          <img src={publishImage} alt="publish" />
          <Link
            to={`/${applicationId}/builds`}
            className={`${CLASS_NAME}__content__action`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              eventData={{
                eventName: "currentBuildTileClick",
              }}
            >
              Go To Page
            </Button>
          </Link>
        </div>
      )}
    </Panel>
  );
}

export default CurrentBuildTile;
