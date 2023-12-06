import React, { useMemo } from "react";

import { ButtonGroup as PrimerButtonGroup } from "@primer/react";
import type { ButtonProps as PrimerButtonProps } from "@primer/react/deprecated";

import { Button, EnumButtonStyle } from "../Button/Button";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import type { CircularProgressProps } from "@mui/material";
import { Box } from "@mui/material";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";

import "./ButtonProgress.scss";

export interface Props
  extends Pick<PrimerButtonProps, "className" | "children" | "onClick"> {
  /** Progress percentage 0-100 */
  progress: number;
  yellowColorThreshold: number;
  redColorThreshold: number;
  leftValue: string;
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
  const {
    yellowColorThreshold,
    redColorThreshold,
    onClick,
    leftValue,
    className,
    children,
  } = props;
  let { progress } = props;

  if (progress < 0) {
    progress = 0;
  }
  if (progress > 100) {
    progress = 100;
  }

  const buttonProgressStyle = useMemo(() => {
    return progress <= redColorThreshold
      ? EnumButtonProgressStyle.Danger
      : progress <= yellowColorThreshold
      ? EnumButtonProgressStyle.Warning
      : EnumButtonProgressStyle.Primary;
  }, [progress, redColorThreshold, yellowColorThreshold]);

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
        onClick={onClick}
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
        onClick={onClick}
        {...rest}
      >
        {children}
      </Button>
    </PrimerButtonGroup>
  );
};
