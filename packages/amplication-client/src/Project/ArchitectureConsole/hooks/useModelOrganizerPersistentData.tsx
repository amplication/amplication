import { useCallback } from "react";
import useLocalStorage from "react-use-localstorage";
import { ModelOrganizerPersistentData } from "../types";
import { isEmpty } from "lodash";

const SAVED_STATE_KEY = "modelOrganization_savedState";

const useModelOrganizerPersistentData = (projectId: string) => {
  const [persistentDataInternal, setPersistentDataInternal] = useLocalStorage(
    `${SAVED_STATE_KEY}__${projectId}`,
    ""
  );

  const clearPersistentData = useCallback(() => {
    setPersistentDataInternal(null);
  }, [setPersistentDataInternal]);

  const persistData = useCallback(
    (data: ModelOrganizerPersistentData) => {
      setPersistentDataInternal(JSON.stringify(data));
    },
    [setPersistentDataInternal]
  );

  const loadPersistentData = useCallback(() => {
    const dataString = persistentDataInternal;

    if (isEmpty(dataString)) {
      return null;
    }

    return JSON.parse(dataString) as ModelOrganizerPersistentData;
  }, [persistentDataInternal]);

  return {
    persistData,
    loadPersistentData,
    clearPersistentData,
  };
};

export default useModelOrganizerPersistentData;
