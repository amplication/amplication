import { useRouteMatch } from "react-router-dom";
import { useAppContext } from "../context/appContext";

type Props = {
  overrideIsPlatformConsole?: boolean | undefined;
};

// Get the base URL for a project with or without the platform console prefix
// If overrideIsPlatformConsole is not provided, the hook will determine if the baseURL is a platform console route based on the current URL
export const useProjectBaseUrl = (
  props?: Props
): {
  baseUrl: string;
  isPlatformConsole: boolean;
} => {
  const { overrideIsPlatformConsole } = props || {};
  const { currentProject, currentWorkspace } = useAppContext();

  const platformMatch = useRouteMatch<{
    workspace: string;
    project: string;
    resource: string;
  }>([
    "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/",
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/",
  ]);

  const isPlatformConsole =
    overrideIsPlatformConsole === undefined
      ? platformMatch?.path.includes("/platform/")
      : overrideIsPlatformConsole;

  const platformPath = isPlatformConsole ? "/platform" : "";

  return {
    baseUrl: `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}`,
    isPlatformConsole,
  };
};
