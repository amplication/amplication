import ReactDiffViewer, {
  DiffMethod,
} from "@amplication/react-diff-viewer-continued";
import { useMemo, useRef, useState } from "react";
import YAML from "yaml";
import * as models from "../models";
import { DIFF_STYLES } from "./PendingChangeDiffEntity";
import omitDeep from "deepdash/omitDeep";
import { DiffEditor, Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  EnumPanelStyle,
  EnumTextStyle,
  Panel,
  PanelCollapsible,
  Text,
} from "@amplication/ui/design-system";

const CLASS_NAME = "pending-change-diff";

const NON_COMPARABLE_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

type Props = {
  oldVersion: models.BlockVersion;
  newVersion: models.BlockVersion;
  splitView: boolean;
};

const setEditorTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme("vs-dark-amp", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#15192c",
    },
  });
};

const CompareBlockVersions = ({ oldVersion, newVersion, splitView }: Props) => {
  const newValue = useMemo(() => {
    return getBlockVersionYAML(newVersion);
  }, [newVersion]);

  const oldValue = useMemo(() => {
    return getBlockVersionYAML(oldVersion);
  }, [oldVersion]);

  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(200); // Initial height

  const handleBeforeMount = (monaco: Monaco) => {
    setEditorTheme(monaco);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    const originalModel = editor.getModel().original;
    const modifiedModel = editor.getModel().modified;

    // Function to calculate the maximum content height from both models
    const updateEditorHeight = () => {
      const lineHeight = editor
        .getOriginalEditor()
        .getOption(monaco.editor.EditorOption.lineHeight);
      const originalLineCount = originalModel.getLineCount();
      const modifiedLineCount = modifiedModel.getLineCount();

      // Calculate the height based on the largest model (original or modified)
      const maxLineCount = Math.max(originalLineCount, modifiedLineCount);
      const height = maxLineCount * lineHeight;

      setEditorHeight(height); // Set the new height
    };

    // Attach event listener to changes in both models (original and modified)
    originalModel.onDidChangeContent(() => updateEditorHeight());
    modifiedModel.onDidChangeContent(() => updateEditorHeight());

    // Initial height adjustment
    updateEditorHeight();
  };

  return (
    <PanelCollapsible
      noPadding
      headerContent={
        <Text textStyle={EnumTextStyle.Normal}>{newVersion?.displayName}</Text>
      }
      initiallyOpen={true}
      className={CLASS_NAME}
    >
      <DiffEditor
        height={editorHeight}
        language="yaml"
        original={oldValue}
        modified={newValue}
        beforeMount={handleBeforeMount}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
        }}
        theme={"vs-dark-amp"}
      />
    </PanelCollapsible>
  );
};

function getBlockVersionYAML(data: models.BlockVersion): string {
  if (!data) return "";
  const { settings, ...rest } = data;

  const flatData = {
    ...rest,
    ...(settings || {}),
  };

  return YAML.stringify(omitDeep(flatData, NON_COMPARABLE_PROPERTIES));
}

export default CompareBlockVersions;
