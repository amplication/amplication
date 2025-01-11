import { useRouteMatch } from "react-router-dom";
import { useMemo } from "react";

type Props = {
  overrideIsPlatformConsole?: boolean | undefined;
  overrideProjectId?: string;
};

// Get the base URL for a project with or without the platform console prefix
// If overrideIsPlatformConsole is not provided, the hook will determine if the baseURL is a platform console route based on the current URL
export const useProjectBaseUrl = (
  props?: Props
): {
  baseUrl: string;
  isPlatformConsole: boolean;
} => {
  const { overrideIsPlatformConsole, overrideProjectId } = props || {};

  const match = useRouteMatch<{
    workspace: string;
    project: string;
  }>([
    "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/",
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/",
    "/:workspace([A-Za-z0-9-]{20,})/",
  ]);

  const results = useMemo(() => {
    if (!match) {
      return {
        baseUrl: "",
        isPlatformConsole: false,
      };
    }

    const isPlatformConsole =
      overrideIsPlatformConsole === undefined
        ? match?.path.includes("/platform/")
        : overrideIsPlatformConsole;

    const projectId = overrideProjectId || match.params.project || "";

    const platformPath = isPlatformConsole ? "/platform" : "";

    const baseUrl = `/${match.params.workspace}${platformPath}/${projectId}`;

    return {
      baseUrl,
      isPlatformConsole,
    };
  }, [match, overrideIsPlatformConsole, overrideProjectId]);

  return results;
};
