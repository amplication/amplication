import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import CustomPropertiesFormField from "../CustomProperties/CustomPropertiesFormField";
import useBlueprintCustomPropertiesMap from "../CustomProperties/hooks/useBlueprintCustomPropertiesMap";

type Props = {
  blueprintId: string;
  fieldNamePrefix: string;
};

export const ResourceSettingsFormFields = ({
  blueprintId,
  fieldNamePrefix,
}: Props) => {
  const { customPropertiesMap } = useBlueprintCustomPropertiesMap(blueprintId);
  const {
    blueprintsMap: { blueprintsMap },
  } = useAppContext();

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
      <>
        {Object.values(customPropertiesMap).map((customProperty) => (
          <CustomPropertiesFormField
            key={customProperty.key}
            property={customProperty}
            fieldNamePrefix={fieldNamePrefix}
            disabled={false}
          />
        ))}
      </>
    )
  );
};
