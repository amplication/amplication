import { useRouteMatch } from "react-router-dom";
import { useAppContext } from "../context/appContext";

type Props = {
  overrideResourceId?: string;
  overrideIsPlatformConsole?: boolean | undefined;
};

// Get the base URL for a resource with or without the platform console prefix
// If overrideIsPlatformConsole is not provided, the hook will determine if the baseURL is a platform console route based on the current URL
// If overrideResourceId is not provided, the hook will use the current resource ID
// when both are not provided, the current url with the platform console prefix and current resource ID will be used
export const useResourceBaseUrl = (
  props?: Props
): {
  baseUrl: string;
  isPlatformConsole: boolean;
} => {
  const { overrideIsPlatformConsole, overrideResourceId } = props || {};
  const { currentResource, currentProject, currentWorkspace } = useAppContext();

  const platformMatch = useRouteMatch<{
    workspace: string;
    project: string;
    resource: string;
  }>([
    "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
    "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/",
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/",
  ]);

  const isPlatformConsole =
    overrideIsPlatformConsole === undefined
      ? platformMatch?.path.includes("/platform/")
      : overrideIsPlatformConsole;

  const resourceId = overrideResourceId || currentResource?.id;
  const platformPath = isPlatformConsole ? "/platform" : "";

  return {
    baseUrl: `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}/${resourceId}`,
    isPlatformConsole,
  };
};
