import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import * as models from "../models";
import CommitResourceListItem from "./CommitResourceListItem";
import DataPanel, { TitleDataType } from "./DataPanel";
import { ChangesByResource } from "./hooks/useCommitChanges";

type Props = {
  commit: models.Commit;
  commitChangesByResource: ChangesByResource;
};

const CLASS_NAME = "commit-resource-list";
const CommitResourceList: React.FC<Props> = ({
  commit,
  commitChangesByResource,
}) => {
  return (
    <div className={CLASS_NAME}>
      <DataPanel
        id={commit.id}
        dataType={TitleDataType.COMMIT}
        createdAt={commit?.createdAt}
        account={commit?.user?.account}
        description={commit?.message}
      />
      {commit.builds && commit.builds.length > 0 && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Tag}>
            {commit.builds.length} builds
          </Text>
        </FlexItem>
      )}
      {commit.builds && commit.builds.length ? (
        <>
          {commit.builds.map((build: models.Build) => (
            <CommitResourceListItem
              key={build.id}
              build={build}
              commitChangesByResource={commitChangesByResource}
            />
          ))}
        </>
      ) : (
        <EmptyState
          message="There are no builds to show"
          image={EnumImages.CommitEmptyState}
        />
      )}
    </div>
  );
};

export default CommitResourceList;
