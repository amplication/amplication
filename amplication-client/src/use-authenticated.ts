import { useState, useEffect } from "react";
import { listen, isAuthenticated } from "./authentication";

export default function useAuthenticated() {
  const [authenticated, setAuthenticated] = useState<boolean>(
    isAuthenticated()
  );
  useEffect(() => {
    listen(setAuthenticated);
  }, [setAuthenticated]);
  return authenticated;
}
