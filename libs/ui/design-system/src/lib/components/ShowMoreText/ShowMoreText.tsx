import classNames from "classnames";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import "./ShowMoreText.scss";

const CLASS_NAME = "amp-show-more-text";

export type Props = {
  gapAfterText?: number;
  lineClamp?: number;
  children: React.ReactNode;
};

export const ShowMoreText = ({
  children,
  gapAfterText = 20,
  lineClamp = 3,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [textHeight, setTextHeight] = useState<number>(0);
  const [shortHeight, setShortHeight] = useState<number>(0);

  const handleShowMoreClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
      ref?.current && setTextHeight(ref.current.scrollHeight + gapAfterText);
    },
    [ref]
  );

  const handleShowLessClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      setTextHeight(shortHeight);
    },
    [shortHeight]
  );

  useEffect(() => {
    if (ref.current && ref.current.clientHeight < ref.current.scrollHeight) {
      setShowLink(true);
      setShortHeight(ref.current.clientHeight);
      setTextHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const textStyle: CSSProperties = {
    WebkitLineClamp: lineClamp,
  };

  if (textHeight) {
    textStyle.height = textHeight;
  }

  return (
    <div className={CLASS_NAME}>
      <span
        className={classNames(`${CLASS_NAME}__text`, { close: !open })}
        style={textStyle}
        ref={ref}
      >
        {children}
      </span>
      {showLink ? (
        !open ? (
          <span className={`${CLASS_NAME}__link`} onClick={handleShowMoreClick}>
            Show More
          </span>
        ) : (
          <span className={`${CLASS_NAME}__link`} onClick={handleShowLessClick}>
            Show Less
          </span>
        )
      ) : null}
    </div>
  );
};
