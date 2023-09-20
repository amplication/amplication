import { MutableRefObject, useEffect, useState } from "react";

const useTextOffsetHeight = (
  textContainerRef: MutableRefObject<any>,
  threshold: number
): boolean => {
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const textContainer = textContainerRef.current;
    setIsOverflow(textContainer && textContainer.offsetHeight > threshold);
  }, [textContainerRef]);

  return isOverflow;
};

export default useTextOffsetHeight;
