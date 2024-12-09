import { ReactFlowInstance } from "reactflow";
import GraphControl from "./GraphControl";
import "./GraphControls.scss";

const CLASS_NAME = "graph-controls";

type Props = {
  reactFlowInstance: ReactFlowInstance;
  onArrangeNodes: () => void;
};

export default function GraphControls({
  reactFlowInstance,
  onArrangeNodes,
}: Props) {
  return (
    <>
      {reactFlowInstance && (
        <div className={CLASS_NAME}>
          <GraphControl
            tooltip="Reset Layout"
            icon="layers"
            onClick={onArrangeNodes}
          />
          <GraphControl
            tooltip="Zoom In"
            icon="plus"
            onClick={reactFlowInstance.zoomIn}
          />
          <GraphControl
            tooltip="Zoom Out"
            icon="minus"
            onClick={reactFlowInstance.zoomOut}
          />
        </div>
      )}
    </>
  );
}
