import * as models from "../models";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import DeleteResourceButton from "./DeleteResourceButton";
import ResourceGitRepo from "./ResourceGitRepo";
import ResourceLastBuild from "./ResourceLastBuild";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

function ResourceListItem({ resource }: Props) {
  const { id, name, description } = resource;

  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: id });

  return (
    <ListItem to={`${baseUrl}`}>
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        start={<ResourceCircleBadge type={resource.resourceType} />}
        end={<DeleteResourceButton resource={resource} />}
      >
        <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
          <FlexItem
            direction={EnumFlexDirection.Row}
            gap={EnumGapSize.Small}
            itemsAlign={EnumItemsAlign.Center}
          >
            <Text
              textStyle={EnumTextStyle.Normal}
              textWeight={EnumTextWeight.SemiBold}
            >
              {name}
            </Text>

            <CodeGeneratorImage resource={resource} />
          </FlexItem>

          {description && (
            <Text textStyle={EnumTextStyle.Description}>{description}</Text>
          )}
        </FlexItem>
      </FlexItem>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        gap={EnumGapSize.Small}
        margin={EnumFlexItemMargin.None}
        start={<ResourceGitRepo resource={resource} />}
      >
        <ResourceLastBuild resource={resource} />
      </FlexItem>
    </ListItem>
  );
}

export default ResourceListItem;
