import React, { useCallback } from "react";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import "@material/ripple/dist/mdc.ripple.css";
import { unsetToken } from "./authentication";
import useAuthenticated from "./use-authenticated";

function Account() {
  const authenticated = useAuthenticated();
  const signOut = useCallback(() => {
    unsetToken();
  }, []);
  return (
    <Button raised onClick={signOut} disabled={!authenticated}>
      Signout
    </Button>
  );
}

export default Account;
