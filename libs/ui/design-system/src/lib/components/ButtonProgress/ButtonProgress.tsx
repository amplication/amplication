import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { ButtonGroup as PrimerButtonGroup } from "@primer/react";
import type { ButtonProps as PrimerButtonProps } from "@primer/react/deprecated";

import { Button, EnumButtonStyle } from "../Button/Button";
import classNames from "classnames";
import CircularProgress from "../CircularProgress/CircularProgress";
import type { Props as CircularProgressProps } from "../CircularProgress/CircularProgress";

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

const Pie = ({ className, value, ...rest }: CircularProgressProps) => {
  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        display: "flex",
      }}
    >
      <CircularProgress
        size="14px"
        {...rest}
        variant="determinate"
        className=".amp-button-progress--background"
        value={100}
        thickness={3}
        sx={{
          color: "#686f8c",
        }}
      />
      <CircularProgress
        defaultColor={false}
        size="14px"
        {...rest}
        variant="determinate"
        value={value}
        thickness={3}
        position="absolute"
        sx={{
          color: "inherit",
          position: "absolute",
        }}
      />
    </Box>
  );
};

export const ButtonProgress = ({
  yellowColorThreshold,
  redColorThreshold,
  onClick,
  leftValue,
  className,
  children,
  progress,
}: Props) => {
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
            className={`amp-button-progress-pie--${buttonProgressStyle}`}
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
      >
        {children}
      </Button>
    </PrimerButtonGroup>
  );
};

ButtonProgress.propsTypes = {
  progress: PropTypes.oneOf([...new Array(100)].map((_, i) => i + 1)),
  yellowColorThreshold: PropTypes.oneOf(
    [...new Array(100)].map((_, i) => i + 1)
  ),
  redColorThreshold: PropTypes.oneOf([...new Array(100)].map((_, i) => i + 1)),
  leftValue: PropTypes.string,
};
