import { formatError } from "../util/error";
import "./Signup.scss";
import { CircularProgress } from "@mui/material";
import useSignupPreviewAccount from "./hooks/useSignupPreviewAccount";
import { PreviewAccountType } from "../models";

const SignupPreviewAccount = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const previewAccountTypeParam = urlParams.get("previewAccountType");
  const emailParam = urlParams.get("email");
  const email = emailParam.replace(/ /g, "+");

  const { loading, error } = useSignupPreviewAccount(
    email,
    PreviewAccountType[previewAccountTypeParam]
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
