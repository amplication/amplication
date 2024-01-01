import { formatError } from "../util/error";
import "./Signup.scss";
import { CircularProgress } from "@mui/material";
import useSignupPreviewAccount from "./hooks/useSignupPreviewAccount";
import { PreviewAccountType } from "../models";

const SignupPreviewAccount = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get("email");
  const previewAccountType = urlParams.get("previewAccountType");

  const { loading, error } = useSignupPreviewAccount(
    email,
    PreviewAccountType[previewAccountType]
  );

  const errorMessage = formatError(error);

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {loading && <CircularProgress />}
    </>
  );
};

export default SignupPreviewAccount;
