import { ReactFlowInstance } from "reactflow";
import ModelOrganizerControl from "./ModelOrganizerControl";
import "./ModelOrganizerControls.scss";

const CLASS_NAME = "model-organizer-controls";

type Props = {
  reactFlowInstance: ReactFlowInstance;
  onArrangeNodes: () => void;
};

export default function ModelOrganizerControls({
  reactFlowInstance,
  onArrangeNodes,
}: Props) {
  return (
    <>
      {reactFlowInstance && (
        <div className={CLASS_NAME}>
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
