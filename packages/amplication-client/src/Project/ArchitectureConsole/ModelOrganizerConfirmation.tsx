import "./ModelOrganizerConfirmation.scss";
import { Button, EnumButtonStyle } from "../../Components/Button";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextWeight,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { EntityNode, ModelChanges, Node } from "./types";
import TempServiceView from "./TempServiceView";
import { useMemo } from "react";

type movedEntitiesData = {
  id: string;
  name: string;
};
export const CLASS_NAME = "model-organizer-confirmation";

type Props = {
  onConfirmChanges: () => void;
  onCancelChanges: () => void;
  changes: ModelChanges;
  nodes: Node[];
};

export default function ModelOrganizerConfirmation({
  onConfirmChanges,
  onCancelChanges,
  nodes,
  changes,
}: Props) {
  const movedEntities = useMemo(() => {
    const movedEntities: movedEntitiesData[] = [];
    nodes
      .filter((n) => n.type === "model")
      .forEach((n: EntityNode) => {
        if (n.data.originalParentNode !== n.parentNode) {
          movedEntities.push({
            id: n.data.payload.id,
            name: n.data.payload.displayName,
          });
        }
      });
    return movedEntities;
  }, [nodes]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__information`}>
        {" "}
        <Text textWeight={EnumTextWeight.Regular}>
          <a
            className={`${CLASS_NAME}__documentation`}
            href={"https://docs.amplication.com"}
            target="blank"
          >
            <Text>{"Check our documentation"}</Text>{" "}
          </a>
          <span>
            {" "}
            to understand how relations between entities are resolved as part of
            this migration process{" "}
          </span>
        </Text>
        <span>
          In case of existing database, data migration may be required
        </span>
      </div>
      {changes?.newServices?.length > 0 && (
        <>
          <Text textWeight={EnumTextWeight.Bold}>{"New services"}</Text>
          <div className={`${CLASS_NAME}__boxList`}>
            {changes.newServices.map((service) => (
              <TempServiceView
                newService={service}
                movedEntities={changes.movedEntities.filter(
                  (e) => e.targetResourceId === service.tempId
                )}
              ></TempServiceView>
            ))}
          </div>
        </>
      )}
      <Text textWeight={EnumTextWeight.Bold}>{"The effected entities:"} </Text>
      <FlexItem
        className={`${CLASS_NAME}__boxList`}
        gap={EnumGapSize.Default}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Start}
      >
        {movedEntities.map((entity) => (
          <span>{entity.name}</span>
        ))}
      </FlexItem>
      <div className={`${CLASS_NAME}__note`}>
        <span style={{ color: "#53DBEE" }}>Note:</span>
        <span>
          All parameters can be updated later on for each service separately.
        </span>
      </div>
      <div className={`${CLASS_NAME}__Buttons`}>
        <Button buttonStyle={EnumButtonStyle.Outline} onClick={onCancelChanges}>
          Cancel
        </Button>
        <Button onClick={onConfirmChanges}>Apply</Button>
      </div>
    </div>
  );
}
