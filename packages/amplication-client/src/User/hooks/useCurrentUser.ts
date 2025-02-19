import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../queries/userQueries";
import * as models from "../../models";

type TData = {
  me: models.User;
};

const useCurrentUser = () => {
  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useQuery<TData>(GET_CURRENT_USER);

  return {
    currentUserData: currentUserData?.me,
    currentUserError,
    currentUserLoading,
  };
};

export default useCurrentUser;
