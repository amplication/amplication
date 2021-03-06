import { EnumPanelStyle, Panel, TimeSince } from "@amplication/design-system";
import { Icon } from "@rmwc/icon";
import { isEmpty } from "lodash";
import React from "react";
import classNames from "classnames";
import { addDays, differenceInDays } from "date-fns";
import * as models from "../models";
import { DeleteApiToken } from "./DeleteApiToken";
import "./ApiTokenListItem.scss";

type DType = {
  deleteEntityField: { id: string };
};

const EXPIRATION_DAYS = 30;

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
  const expirationDate = addDays(
    new Date(apiToken.lastAccessAt),
    EXPIRATION_DAYS
  );
  const expired = differenceInDays(new Date(), expirationDate) > 0;
  const newToken = !isEmpty(apiToken.token);
  const createdDate = new Date(apiToken.createdAt);

  return (
    <Panel
      className={classNames(
        CLASS_NAME,
        {
          [`${CLASS_NAME}--expired`]: expired,
        },
        {
          [`${CLASS_NAME}--new`]: newToken,
        }
      )}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__panel-tag`}>
        <Icon icon={{ icon: "key", size: "medium" }} />
      </div>
      <div className={`${CLASS_NAME}__panel-details`}>
        <div className={`${CLASS_NAME}__row`}>
          <h3>{apiToken.name}</h3>
          <span className="spacer" />
          <div className={`${CLASS_NAME}__created`}>
            Created <TimeSince time={createdDate} />
          </div>
          <div
            className={classNames(`${CLASS_NAME}__expiration`, {
              [`${CLASS_NAME}__expiration--expired`]: expired,
            })}
          >
            Expiration <TimeSince time={expirationDate} />
          </div>
        </div>
        {newToken && (
          <div className={`${CLASS_NAME}__row`}>{apiToken.token}</div>
        )}
        <div className={`${CLASS_NAME}__row`}>
          {!newToken && (
            <span className={`${CLASS_NAME}__token-preview`}>
              ***********{apiToken.previewChars}
            </span>
          )}
          <span className="spacer" />
          <DeleteApiToken
            apiToken={apiToken}
            onDelete={onDelete}
            onError={onError}
          />
        </div>
      </div>
    </Panel>
  );
};
