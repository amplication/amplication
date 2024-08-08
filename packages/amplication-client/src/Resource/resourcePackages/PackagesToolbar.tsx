import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Panel,
} from "@amplication/ui/design-system";
import { EnumFlexDirection } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import NewPackageCreateButton from "./NewPackageCreateButton";

const PackagesToolbar = () => {
  return (
    <Panel panelStyle={EnumPanelStyle.Bold}>
      <FlexItem margin={EnumFlexItemMargin.None}>
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <NewPackageCreateButton />
          </FlexItem>
        </FlexItem.FlexEnd>
      </FlexItem>
    </Panel>
  );
};

export default PackagesToolbar;
