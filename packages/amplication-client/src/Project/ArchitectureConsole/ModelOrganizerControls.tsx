import { ReactFlowInstance } from "reactflow";
import ModelOrganizerControl from "./ModelOrganizerControl";
import "./ModelOrganizerControls.scss";

const CLASS_NAME = "model-organizer-controls";

type Props = {
  reactFlowInstance: ReactFlowInstance;
  onToggleShowRelationDetails: () => void;
  onArrangeNodes: () => void;
};

export default function ModelOrganizerControls({
  reactFlowInstance,
  onToggleShowRelationDetails,
  onArrangeNodes,
}: Props) {
  return (
    <>
      {reactFlowInstance && (
        <div className={CLASS_NAME}>
          <ModelOrganizerControl
            tooltip="Toggle Field List"
            icon="list"
            onClick={onToggleShowRelationDetails}
          />
          <ModelOrganizerControl
            tooltip="Reset Layout"
            icon="layers"
            onClick={onArrangeNodes}
          />
          <ModelOrganizerControl
            tooltip="Zoom In"
            icon="plus"
            onClick={reactFlowInstance.zoomIn}
          />
          <ModelOrganizerControl
            tooltip="Zoom Out"
            icon="minus"
            onClick={reactFlowInstance.zoomOut}
          />
        </div>
      )}
    </>
  );
}
