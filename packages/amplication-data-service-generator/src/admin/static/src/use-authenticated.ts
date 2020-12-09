import { useState, useEffect } from "react";
import { listen, isAuthenticated } from "./auth";

export default function useAuthenticated() {
  const [authenticated, setAuthenticated] = useState<boolean>(
    isAuthenticated()
  );
  useEffect(() => {
    listen(setAuthenticated);
  }, [setAuthenticated]);
  return authenticated;
}
