import React from "react";
import { Link } from "react-router-dom";

import * as models from "../models";
import { ClickableId } from "../Components/ClickableId";

import "./BuildHeader.scss";

const CLASS_NAME = "build-header";

type Props = {
  build: models.Build;
  isError: boolean;
};

const BuildHeader = ({ build, isError }: Props) => {
  const deployedClassName = `${CLASS_NAME}--deployed`;

  return (
    <div className={`${CLASS_NAME} ${deployedClassName} `}>
      <ClickableId
        to={`/${build.resourceId}/builds/${build.id}`}
        id={build.id}
        label="Build ID"
        eventData={{
          eventName: "buildHeaderIdClick",
        }}
      />
      {isError ? (
        <Link to={`/${build.resourceId}/builds/${build.id}`}>
          <h3 className="error-message">Build Failed Check Logs</h3>
        </Link>
      ) : null}
      <span className="spacer" />
    </div>
  );
};

export default BuildHeader;
