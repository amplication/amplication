import { memo, type FC, useContext } from "react";

import * as models from "../../../models";
import { AppContext } from "../../../context/appContext";
import "./modelGroupNode.scss";
import {
  EnumTextStyle,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";

interface ModelProps {
  data: {
    payload: models.Resource;
  };
}

const CLASS_NAME = "model-group-node";

const ModelGroupNode: FC<ModelProps> = memo(({ data }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  return (
    <div
      className={`${CLASS_NAME}`}
      tabIndex={0}
      title={data.payload.description}
    >
      <Text textStyle={EnumTextStyle.H3}>{data.payload.name}</Text>
      <HorizontalRule />
    </div>
  );
});
ModelGroupNode.displayName = "ModelGroupNode";

export default ModelGroupNode;
