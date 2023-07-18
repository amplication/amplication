import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { setToken } from "../authentication/authentication";
import useLocalStorage from "react-use-localstorage";

import { LOCAL_STORAGE_KEY_INVITATION_TOKEN } from "../App";

type TData = {
  completeInvitation: {
    token: string;
  };
};
/**
 * Looks for invitation token in local storage, and send a CompleteInvitation request to the server
 * After a successful request - the page is reloaded with the new user token
 * This components needs to be located in a <PrivateRoute/> to make sure it is only executed after sign up or sign in
 */
const CompleteInvitation = () => {
  const history = useHistory();
  const [invitationToken, setInvitationToken] = useLocalStorage(
    LOCAL_STORAGE_KEY_INVITATION_TOKEN,
    undefined
  );

  const [completeInvitation] = useMutation<TData>(COMPLETE_INVITATION, {
    onCompleted: (data) => {
      setToken(data.completeInvitation.token);
      setInvitationToken("");
      history.replace("/");
      window.location.reload();
    },
  });

  useEffect(() => {
    if (!isEmpty(invitationToken)) {
      completeInvitation({
        variables: {
          token: invitationToken,
        },
      }).catch(console.error);
    }
  }, [invitationToken, history, completeInvitation]);

  return null;
};

export default CompleteInvitation;

const COMPLETE_INVITATION = gql`
  mutation completeInvitation($token: String!) {
    completeInvitation(data: { token: $token }) {
      token
    }
  }
`;
