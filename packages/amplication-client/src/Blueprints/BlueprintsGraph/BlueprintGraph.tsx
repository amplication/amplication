import { Snackbar } from "@amplication/ui/design-system";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowInstance,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import useMessage from "../../util/useMessage";
import "./BlueprintGraph.scss";
import GraphControls from "../../Components/GraphComponents/GraphControls";
import GraphToolbar from "../../Components/GraphComponents/GraphToolbar";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import useBlueprintGraph from "./hooks/useBlueprintGraph";
import { applyAutoLayout } from "./layout";
import BlueprintNode from "./nodes/BlueprintNode";
import { Node, NodePayloadWithPayloadType } from "./types";

export const CLASS_NAME = "blueprint-graph";
const REACT_FLOW_CLASS_NAME = "reactflow-wrapper";
const MESSAGE_AUTO_HIDE_DURATION = 3000;

const simpleNodeTypes = {
  blueprint: BlueprintNode,
};

const edgeTypes = {
  relationSimple: simpleRelationEdge,
};

export default function BlueprintGraph() {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const { message, messageType, showMessage, removeMessage } = useMessage();

  const {
    nodes,
    setNodes,
    edges,
    onEdgesChange,
    searchPhraseChanged,
    setSelectRelatedNodes,
  } = useBlueprintGraph({
    onMessage: showMessage,
  });

  const fitViewTimerRef = useRef(null);

  const fitToView = useCallback(
    (delayBeforeStart = 100) => {
      if (reactFlowInstance) {
        if (delayBeforeStart > 0) {
          fitViewTimerRef.current = setTimeout(() => {
            reactFlowInstance.fitView({ duration: 1000 });
          }, delayBeforeStart);
        } else {
          reactFlowInstance.fitView({ duration: 1000 });
        }
      }
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    // Clear the timeout ref when the component unmounts
    return () => clearTimeout(fitViewTimerRef.current);
  }, []);

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges<NodePayloadWithPayloadType>(
        changes,
        nodes
      );
      setNodes(updatedNodes as Node[]);
    },
    [nodes, setNodes]
  );

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (!instance) return;
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(nodes, edges);
    setNodes(updatedNodes);
    fitToView();
  }, [nodes, edges, setNodes, fitToView]);

  const onNodeClick = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      if (!node.data.selectRelatedNodes) return;
      setSelectRelatedNodes(node);
    },
    [setSelectRelatedNodes]
  );

  return (
    <div className={CLASS_NAME}>
      <>
        <div className={`${CLASS_NAME}__container`}>
          <div className={`${CLASS_NAME}__side_toolbar`}>
            <GraphControls
              onArrangeNodes={onArrangeNodes}
              reactFlowInstance={reactFlowInstance}
            />
          </div>
          <div className={`${CLASS_NAME}__body`}>
            <GraphToolbar searchPhraseChanged={searchPhraseChanged} />

            <div className={REACT_FLOW_CLASS_NAME}>
              <ReactFlow
                onInit={onInit}
                nodes={nodes}
                edges={edges}
                fitView
                nodeTypes={simpleNodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionMode={ConnectionMode.Loose}
                onNodeClick={onNodeClick}
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
                panOnScroll
                selectionKeyCode={null}
              >
                <Background color="grey" />
              </ReactFlow>
            </div>
          </div>
          <Snackbar
            open={Boolean(message)}
            message={message}
            messageType={messageType}
            autoHideDuration={MESSAGE_AUTO_HIDE_DURATION}
            onClose={removeMessage}
          />
        </div>
      </>
    </div>
  );
}
