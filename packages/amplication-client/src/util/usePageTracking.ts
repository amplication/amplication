import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import * as analytics from "./analytics";

const usePageTracking = () => {
  const match = useRouteMatch();

  useEffect(() => {
    analytics.page(match.path, { path: match.path });
  }, []);

  return null;
};

export default usePageTracking;
