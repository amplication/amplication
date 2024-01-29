import { useCallback } from "react";
import { ReactFlowInstance } from "reactflow";
import ModelOrganizerControl from "./ModelOrganizerControl";
import useModelOrganization from "./hooks/useModelOrganizer";
import { applyAutoLayout } from "./layout";
import "./ModelOrganizerControls.scss";

const CLASS_NAME = "model-organizer-controls";

type Props = {
  reactFlowInstance: ReactFlowInstance;
  onToggleShowRelationDetails: () => void;
};

export default function ModelOrganizerControls({
  reactFlowInstance,
  onToggleShowRelationDetails,
}: Props) {
  const { nodes, setNodes, edges, showRelationDetails } =
    useModelOrganization();

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    reactFlowInstance.fitView();
  }, [setNodes, showRelationDetails, reactFlowInstance, nodes, edges]);

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
