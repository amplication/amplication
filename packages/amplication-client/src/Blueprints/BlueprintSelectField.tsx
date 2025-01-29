import {
  SelectPanelField,
  SelectPanelFieldProps,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { EnumResourceType } from "../models";
import { resourceThemeMap } from "../Resource/constants";
import useBlueprints from "./hooks/useBlueprints";

type Props = Omit<SelectPanelFieldProps, "options"> & {
  useKeyAsValue?: boolean;
  onChange?: (value: string) => void;
};

const BlueprintSelectField = (props: Props) => {
  const { findBlueprintsData } = useBlueprints();
  const { useKeyAsValue, ...rest } = props;

  const options = useMemo(() => {
    return findBlueprintsData?.blueprints
      .filter((blueprint) => blueprint.enabled)
      .map((blueprint) => ({
        value: useKeyAsValue ? blueprint.key : blueprint.id,
        label: blueprint.name,
        enabled: blueprint.enabled,
        description: blueprint.description,
        color:
          blueprint.color || resourceThemeMap[EnumResourceType.Component].color,
      }));
  }, [findBlueprintsData?.blueprints, useKeyAsValue]);

  return <SelectPanelField {...rest} options={options} />;
};

export default BlueprintSelectField;
