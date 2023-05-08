import { UserAndTime } from "@amplication/ui/design-system";
import React from "react";
import { TruncatedId } from "../Components/TruncatedId";
import { Account, Maybe } from "../models";
import "./DataPanel.scss";

export enum TitleDataType {
  COMMIT = "Commit",
  BUILD = "Build",
}

type Props = {
  id: string;
  dataType: TitleDataType;
  createdAt: Date;
  account?: Maybe<Account> | undefined;
  relatedDataName?: string;
  relatedDataId?: string;
  description?: string;
};

const CLASS_NAME = "data-panel";

const DataPanel: React.FC<Props> = ({
  id,
  dataType,
  createdAt,
  account,
  relatedDataId,
  relatedDataName,
  description,
}) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__main`}>
        <p className={`${CLASS_NAME}__title`}>
          {dataType} <TruncatedId id={id} />
          {relatedDataId && relatedDataName && (
            <span className={`${CLASS_NAME}__related-data-id`}>
              {relatedDataName} <TruncatedId id={relatedDataId} />
            </span>
          )}
        </p>

        <UserAndTime account={account} time={createdAt} />
      </div>
      {description && (
        <span className={`${CLASS_NAME}__description`}>{description}</span>
      )}
      <hr className={`${CLASS_NAME}__divider`} />
    </div>
  );
};

export default DataPanel;
