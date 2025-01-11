import { useCallback } from "react";
import useLocalStorage from "react-use-localstorage";
import { isEmpty } from "lodash";

function useLocalStorageData<T>(key: string) {
  const [persistentDataInternal, setPersistentDataInternal] = useLocalStorage(
    key,
    ""
  );

  const clearPersistentData = useCallback(() => {
    setPersistentDataInternal(null);
  }, [setPersistentDataInternal]);

  const persistData = useCallback(
    (data: T) => {
      setPersistentDataInternal(JSON.stringify(data));
    },
    [setPersistentDataInternal]
  );

  const loadPersistentData = useCallback((): T => {
    const dataString = persistentDataInternal;

    if (isEmpty(dataString)) {
      return null;
    }

    return JSON.parse(dataString) as T;
  }, [persistentDataInternal]);

  return {
    persistData,
    loadPersistentData,
    clearPersistentData,
  };
}

export default useLocalStorageData;
