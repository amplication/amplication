import {
  CircleBadge,
  EnumButtonStyle,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { PluginCategory } from "./hooks/useResourceSummary";
import { useCallback } from "react";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useTracking } from "../util/analytics";

type Props = {
  availableCategories: PluginCategory[];
};

const EVENT_LOCATION = "AddFunctionalityButton";

const AddResourceFunctionalityButton = ({ availableCategories }: Props) => {
  const { currentProject, currentResource, currentWorkspace } = useAppContext();
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (category: PluginCategory) => {
      trackEvent({
        eventName: AnalyticsEventNames.PluginCategoryTileClick,
        location: EVENT_LOCATION,
        category: category.name,
      });
    },
    [trackEvent]
  );

  const categories = availableCategories.slice(0, 4);

  return (
    <SelectMenu
      hideSelectedItemsIndication
      title="Add functionality"
      buttonStyle={EnumButtonStyle.Primary}
    >
      <SelectMenuModal align="right">
        <SelectMenuList>
          {categories.map((category) => (
            <Link
              key={category.name}
              onClick={() => {
                handleClick(category);
              }}
              to={`/${currentWorkspace.id}/${currentProject.id}/${
                currentResource.id
              }/plugins/catalog/${encodeURIComponent(category.name)}`}
            >
              <SelectMenuItem
                key={category.name}
                closeAfterSelectionChange
                itemData={category}
              >
                <FlexItem itemsAlign={EnumItemsAlign.Center}>
                  <CircleBadge
                    color={EnumTextColor.ThemeTurquoise}
                    size={"small"}
                  >
                    <Icon icon={category.icon || "plugin"} size={"small"} />
                  </CircleBadge>
                  <Text
                    textStyle={EnumTextStyle.Tag}
                    textColor={EnumTextColor.White}
                  >
                    {category.name}
                  </Text>
                </FlexItem>
              </SelectMenuItem>
            </Link>
          ))}
          <HorizontalRule />
          <Link
            to={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/catalog`}
          >
            <SelectMenuItem closeAfterSelectionChange>
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                end={<Icon icon="chevron_right" size="small" />}
              >
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.White}
                >
                  View all
                </Text>
              </FlexItem>
            </SelectMenuItem>
          </Link>
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};

export default AddResourceFunctionalityButton;
