import React from "react";
import CommitResourceListItem from "./CommitResourceListItem";
import * as models from "../models";
import DataPanel, { TitleDataType } from "./DataPanel";
import { EnumImages } from "../Components/SvgThemeImage";
import { EmptyState } from "../Components/EmptyState";
import { CommitChangesByResource } from "./hooks/useCommits";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  List,
  Text,
} from "@amplication/ui/design-system";

type Props = {
  commit: models.Commit;
  commitChangesByResource: CommitChangesByResource;
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
            {commit.builds.length} resources
          </Text>
        </FlexItem>
      )}
      {commit.builds && commit.builds.length ? (
        <List>
          {commit.builds.map((build: models.Build) => (
            <CommitResourceListItem
              key={build.id}
              build={build}
              commitChangesByResource={commitChangesByResource}
            />
          ))}
        </List>
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
