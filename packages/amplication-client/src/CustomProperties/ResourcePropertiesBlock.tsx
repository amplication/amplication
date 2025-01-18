import {
  HorizontalRule,
  LabelValuePairsBlock,
  LabelValuePairsBlockItem,
} from "@amplication/ui/design-system";
import { useAppContext } from "../context/appContext";
import { Resource } from "../models";
import CustomPropertyValue from "./CustomPropertyValue";
import ResourceOwner from "../Workspaces/ResourceOwner";
import useResourceSettings from "../ResourceSettings/hooks/useResourceSettings";
import useBlueprintCustomPropertiesMap from "./hooks/useBlueprintCustomPropertiesMap";

type Props = {
  resource: Resource;
};

function ResourcePropertiesBlock({ resource }: Props) {
  const { customPropertiesMap } = useAppContext();

  const { resourceSettings } = useResourceSettings(resource?.id);

  const { customPropertiesMap: blueprintCustomPropertiesMap } =
    useBlueprintCustomPropertiesMap(resource?.blueprintId);

  return (
    <>
      <LabelValuePairsBlock>
        <LabelValuePairsBlockItem
          label={"Owner"}
          content={<ResourceOwner resource={resource} />}
        />
        <HorizontalRule />
        {resource.properties &&
          Object.keys(resource.properties).map((property) => (
            <>
              {customPropertiesMap[property] && (
                <LabelValuePairsBlockItem
                  label={customPropertiesMap[property].name}
                  content={
                    <CustomPropertyValue
                      key={property}
                      propertyKey={property}
                      allValues={resource.properties}
                    />
                  }
                />
              )}
            </>
          ))}

        {resourceSettings && blueprintCustomPropertiesMap && (
          <>
            <HorizontalRule />
            {Object.keys(resourceSettings.properties).map((property) => (
              <>
                <LabelValuePairsBlockItem
                  label={blueprintCustomPropertiesMap[property]?.name}
                  content={
                    <CustomPropertyValue
                      key={property}
                      propertyKey={property}
                      allValues={resourceSettings.properties}
                      propertiesMap={blueprintCustomPropertiesMap}
                    />
                  }
                />
              </>
            ))}
          </>
        )}
      </LabelValuePairsBlock>
    </>
  );
}

export default ResourcePropertiesBlock;
