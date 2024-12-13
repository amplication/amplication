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
import { useEffect, useMemo } from "react";
import { CreateResourceType } from "./CreateResourceForm";
import { useFormikContext } from "formik";
import { useAppContext } from "../../context/appContext";

type Props = {
  blueprintId: string;
  fieldNamePrefix?: string;
};

export const ResourceSettingsFormFields = ({
  blueprintId,
  fieldNamePrefix,
}: Props) => {
  const { customPropertiesMap } = useBlueprintCustomPropertiesMap(blueprintId);
  const {
    blueprintsMap: { blueprintsMap },
  } = useAppContext();
  const { setFieldValue } = useFormikContext<CreateResourceType>();

  useEffect(() => {
    //remove properties when blueprint changes
    if (blueprintId) {
      setFieldValue("settings.properties", {});
    }
  }, [blueprintId, setFieldValue]);

  const blueprint = useMemo(
    () =>
      Object.values(blueprintsMap).find(
        (blueprint) => blueprint.id === blueprintId
      ),
    [blueprintsMap, blueprintId]
  );

  const hasProperties = Object.values(customPropertiesMap).length > 0;

  return (
    blueprint &&
    hasProperties && (
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
