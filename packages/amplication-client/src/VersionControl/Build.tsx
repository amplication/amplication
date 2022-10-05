import React from "react";

import * as models from "../models";
import {
  UserAndTime,
  Panel,
  EnumPanelStyle,
  PanelHeader,
} from "@amplication/design-system";

import useBuildWatchStatus from "./useBuildWatchStatus";
import BuildSteps from "./BuildSteps";

import "./Build.scss";
import BuildHeader from "./BuildHeader";

const CLASS_NAME = "build";

type Props = {
  build: models.Build;
  onError: (error: Error) => void;
  open: boolean;
};

const Build = ({ build, onError, open }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const account = build.createdBy?.account;

  return (
    <Panel panelStyle={EnumPanelStyle.Transparent} className={`${CLASS_NAME}`}>
      <PanelHeader>Build details</PanelHeader>
      <div className={`${CLASS_NAME}__message`}>{data.build.message}</div>
      <UserAndTime account={account} time={build.createdAt} />
      <BuildHeader build={data.build} isError={open} />
      <BuildSteps build={data.build} onError={onError} />
    </Panel>
  );
};

export default Build;
