import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import ResourceRelationsForm from "./ResourceRelationForm";
import useResourceRelations from "./hooks/useResourceRelations";
import {
  EnumPanelStyle,
  Panel,
  TabContentTitle,
} from "@amplication/ui/design-system";

const CLASS_NAME = "resource-relations";

function ResourceRelations() {
  const {
    blueprintsMap: { blueprintsMap },
    currentResource,
  } = useAppContext();

  const { relations } = useResourceRelations(currentResource?.id);

  const relationsMap = useMemo(() => {
    return relations.reduce((map, relation) => {
      map[relation.relationKey] = relation;
      return map;
    }, {});
  }, [relations]);

  const currentBlueprint = useMemo(() => {
    return Object.values(blueprintsMap).find(
      (blueprint) => blueprint.id === currentResource?.blueprint?.id
    );
  }, [blueprintsMap, currentResource?.blueprint?.id]);

  return (
    <div className={CLASS_NAME}>
      {relationsMap &&
        currentBlueprint?.relations &&
        currentBlueprint?.relations.length > 0 && (
          <>
            <TabContentTitle title="Related Resources" />
            <Panel panelStyle={EnumPanelStyle.Bordered}>
              {currentBlueprint?.relations?.map((relationDef) => (
                <ResourceRelationsForm
                  key={relationDef.key}
                  resourceId={currentResource?.id}
                  relation={relationsMap[relationDef.key]}
                  relationDef={relationDef}
                />
              ))}
            </Panel>
          </>
        )}
    </div>
  );
}

export default ResourceRelations;
