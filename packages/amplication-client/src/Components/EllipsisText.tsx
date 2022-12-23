import React, { useCallback, useState } from "react";
import "./EllipsisText.scss";

type EllipsisTextProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  text: string;
  maxLength?: number;
  maxHeight?: number;
  trigger?: ["click" | "hover"];
};

const EllipsisText = ({
  text,
  trigger = ["click"],
  maxLength = 180,
  maxHeight,
  ...restProps
}: EllipsisTextProps) => {
  const [expanded, setExpanded] = useState(false);

  const isHoverMode = trigger.includes("hover");

  const handleClick = useCallback(() => {
    const isActive = trigger.includes("click");
    isActive && setExpanded(!expanded);
  }, [trigger]);

  const handleMouseEnter = useCallback(() => {
    isHoverMode && !expanded && setExpanded(true);
  }, [expanded, trigger]);

  const handleMouseLeave = useCallback(() => {
    isHoverMode && expanded && setExpanded(false);
  }, [expanded, trigger]);

  if (text.length <= maxLength) {
    return <span {...restProps}>{text}</span>;
  }

  return (
    <span
      {...restProps}
      style={{
        maxHeight,
        overflowY: maxHeight && expanded ? "scroll" : "hidden",
      }}
      onMouseLeave={handleMouseLeave}
    >
      {expanded ? text : `${text.substring(0, maxLength)}...`}
      <button
        className={"ellipsis__button"}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {expanded ? !isHoverMode && "Show Less" : "Show More"}
      </button>
    </span>
  );
};

export default EllipsisText;
