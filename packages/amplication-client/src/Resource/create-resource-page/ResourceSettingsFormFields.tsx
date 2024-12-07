import {
  FlexItem,
  EnumFlexItemMargin,
  EnumTextStyle,
  EnumPanelStyle,
  FormColumns,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import CustomPropertiesFormField from "../../CustomProperties/CustomPropertiesFormField";
import useBlueprintCustomPropertiesMap from "../../CustomProperties/hooks/useBlueprintCustomPropertiesMap";
import useBlueprintsMap from "../../Blueprints/hooks/useBlueprintsMap";
import { useMemo } from "react";

type Props = {
  blueprintId: string;
  fieldNamePrefix?: string;
};

export const ResourceSettingsFormFields = ({
  blueprintId,
  fieldNamePrefix,
}: Props) => {
  const { customPropertiesMap } = useBlueprintCustomPropertiesMap(blueprintId);
  const { blueprintsMap } = useBlueprintsMap();

  const blueprint = useMemo(
    () =>
      Object.values(blueprintsMap).find(
        (blueprint) => blueprint.id === blueprintId
      ),
    [blueprintsMap, blueprintId]
  );

  return (
    blueprint && (
      <div>
        <FlexItem margin={EnumFlexItemMargin.Both}>
          <Text textStyle={EnumTextStyle.H4}>
            {blueprint?.name} Configuration
          </Text>
        </FlexItem>
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <FormColumns>
            {blueprintId &&
              Object.values(customPropertiesMap).map((customProperty) => (
                <CustomPropertiesFormField
                  key={customProperty.key}
                  property={customProperty}
                  fieldNamePrefix={fieldNamePrefix}
                />
              ))}
          </FormColumns>
        </Panel>
      </div>
    )
  );
};
