import { EnumPanelStyle, Panel, TimeSince } from "@amplication/design-system";
import React from "react";
import * as models from "../models";
import { DeleteApiToken } from "./DeleteApiToken";
import "./ApiTokenListItem.scss";

type DType = {
  deleteEntityField: { id: string };
};

type Props = {
  applicationId: string;
  apiToken: models.ApiToken;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "api-token-list-item";

export const ApiTokenListItem = ({
  applicationId,
  apiToken,
  onDelete,
  onError,
}: Props) => {
  const lastAccessDate = apiToken.lastAccessAt
    ? new Date(apiToken.lastAccessAt)
    : null;

  const createdDate = new Date(apiToken.createdAt);

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__row`}>
        <span>{apiToken.name}</span>
        <span className="spacer" />
        Created <TimeSince time={createdDate} />
      </div>

      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__highlight`}>
          ***********{apiToken.previewChars}
        </span>
        <span className="spacer" />
        <DeleteApiToken
          apiToken={apiToken}
          onDelete={onDelete}
          onError={onError}
        />
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span>
          Last used {lastAccessDate && <TimeSince time={lastAccessDate} />}
        </span>
      </div>
    </Panel>
  );
};
