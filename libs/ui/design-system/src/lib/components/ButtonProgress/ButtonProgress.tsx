import React from "react";

import { ButtonGroup as PrimerButtonGroup } from "@primer/react";
import type { ButtonProps as PrimerButtonProps } from "@primer/react/deprecated";

import "./ButtonProgress.scss";
import { Button, EnumButtonStyle } from "../Button/Button";
import classNames from "classnames";
import { CircularProgress, circularProgressClasses } from "@mui/material";
import type { CircularProgressProps } from "@mui/material";
import { Box } from "@mui/material";
import { margin } from "@mui/system";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumFormStyle } from "../Form/Form";

export interface Props
  extends Pick<PrimerButtonProps, "className" | "children" | "onClick"> {
  /** Progress percentage 0-100 */
  progress: number;
  yellowColorThreshold: number;
  redColorThreshold: number;
  leftValue: string;
  rest?: any;
}

enum EnumButtonProgressStyle {
  Primary = "primary",
  Warning = "warning",
  Danger = "danger",
}

const Pie = (props: CircularProgressProps) => {
  return (
    <Box
      className={props.className}
      sx={{
        position: "relative",
        display: "flex",
      }}
    >
      <CircularProgress
        {...props}
        variant="determinate"
        className=".amp-button-progress--background"
        value={100}
        thickness={3}
        sx={{
          color: "#686f8c",
        }}
      />
      <CircularProgress
        {...props}
        variant="determinate"
        value={props.value}
        thickness={3}
        sx={{
          color: "inherit",
          position: "absolute",
        }}
      />
    </Box>
  );
};

export const ButtonProgress = (props: Props) => {
  let {
    yellowColorThreshold,
    redColorThreshold,
    progress,
    leftValue,
    className,
    children,
    rest,
  } = props;

  if (progress < 0) {
    progress = 0;
  }
  if (progress > 100) {
    progress = 100;
  }

  let buttonProgressStyle: EnumButtonProgressStyle;
  if (progress <= redColorThreshold) {
    buttonProgressStyle = EnumButtonProgressStyle.Danger;
  } else if (progress <= yellowColorThreshold) {
    buttonProgressStyle = EnumButtonProgressStyle.Warning;
  } else {
    buttonProgressStyle = EnumButtonProgressStyle.Primary;
  }

  return (
    <PrimerButtonGroup
      className={classNames(
        "amp-button-progress",
        `amp-button-progress--${buttonProgressStyle}`
      )}
    >
      <Button
        className={classNames(
          "amp-button-progress",
          className,
          `amp-button-progress--left`,
          `amp-button-progress--${buttonProgressStyle}--left`
        )}
        buttonStyle={EnumButtonStyle.Outline}
        {...rest}
      >
        <FlexItem
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
          gap={EnumGapSize.Small}
        >
          <Pie
            value={progress}
            size="14px"
            className={classNames(
              `amp-button-progress-pie--${buttonProgressStyle}`
            )}
          />
          {leftValue}
        </FlexItem>
      </Button>
      <Button
        className={classNames(
          "amp-button-progress",
          className,
          "amp-button-progress--right",
          `amp-button-progress--${buttonProgressStyle}--right`
        )}
        {...rest}
      >
        {children}
      </Button>
    </PrimerButtonGroup>
  );
};
