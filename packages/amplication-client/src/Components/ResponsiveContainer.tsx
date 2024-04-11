import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import useResizeObserver from "@react-hook/resize-observer";

const DEFAULT_MIN_WIDTH_CLASSES: { [key: string]: number }[] = [
  { xxl: 1400 },
  { xl: 1200 },
  { lg: 992 },
  { md: 768 },
  { sm: 576 },
];

type Props = {
  children: React.ReactNode;
  className: string;
  minWidthClasses?: { [key: string]: number }[]; // the array must be sorted by the breakpoint size, the first breakpoint should be the largest
};

const useWidth = (target) => {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => setWidth(entry.contentRect.width));
  return width;
};

function ResponsiveContainer({
  children,
  className,
  minWidthClasses = DEFAULT_MIN_WIDTH_CLASSES,
}: Props) {
  const divRef = useRef(null);
  const width = useWidth(divRef);

  const [responsiveClassName, setResponsiveClassName] = useState<string>("");

  useEffect(() => {
    if (minWidthClasses) {
      const breakPoint = minWidthClasses.filter(
        (minWidthClass) => width > Object.values(minWidthClass)[0]
      );

      const classes = breakPoint.map(
        (minWidthClass) => `${className}--${Object.keys(minWidthClass)[0]}`
      );

      setResponsiveClassName(classes.join(" "));
    }
  }, [className, minWidthClasses, width]);

  return (
    <div ref={divRef} className={classNames(className, responsiveClassName)}>
      {children}
    </div>
  );
}

export default ResponsiveContainer;
