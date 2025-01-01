import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries/userQueries";
import * as models from "../../models";

const useUser = (userId: string) => {
  const {
    data: getUserData,
    loading: getUserLoading,
    error: getUserError,
  } = useQuery<{
    user: models.User;
  }>(GET_USER, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  });

  return {
    getUserData: getUserData?.user,
    getUserError,
    getUserLoading,
  };
};

export default useUser;
