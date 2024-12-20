import {
  FlexItem,
  EnumFlexItemMargin,
  EnumTextStyle,
  EnumPanelStyle,
  FormColumns,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useEffect, useMemo } from "react";
import { CreateResourceType } from "./CreateResourceForm";
import { useFormikContext } from "formik";
import { useAppContext } from "../../context/appContext";
import { ResourceSettingsFormFields } from "../../ResourceSettings/ResourceSettingsFormFields";

type Props = {
  blueprintId: string;
  fieldNamePrefix?: string;
};

export const CreateResourceFormResourceSettings = ({
  blueprintId,
  fieldNamePrefix,
}: Props) => {
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
            <ResourceSettingsFormFields blueprintId={blueprintId} />
          </FormColumns>
        </Panel>
      </div>
    )
  );
};
