import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Text,
  UserAndTime,
} from "@amplication/ui/design-system";
import React from "react";
import { TruncatedId } from "../Components/TruncatedId";
import { Account, Maybe } from "../models";

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
      <FlexItem>
        <FlexItem.FlexStart>
          <Text textStyle={EnumTextStyle.H4}>
            {dataType} <TruncatedId id={id} />
          </Text>

          {relatedDataId && relatedDataName && (
            <Text textStyle={EnumTextStyle.Tag}>
              {relatedDataName} <TruncatedId id={relatedDataId} />
            </Text>
          )}
        </FlexItem.FlexStart>
        <FlexItem.FlexEnd>
          <UserAndTime account={account} time={createdAt} />
        </FlexItem.FlexEnd>
      </FlexItem>

      {description && (
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Tag}>{description}</Text>
        </FlexItem>
      )}
      <HorizontalRule />
    </div>
  );
};

export default DataPanel;
