import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import * as analytics from "./analytics";

const usePageTracking = () => {
  const match = useRouteMatch();

  useEffect(() => {
    const url = `${window.location.origin}${match.path}`;
    const path = match.path.replaceAll(":", "");
    analytics.page(path.replaceAll("/", "-"), {
      path,
      url,
      params: match.params,
    });
  }, []);

  return null;
};

export default usePageTracking;
