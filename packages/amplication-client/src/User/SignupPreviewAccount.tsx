import { formatError } from "../util/error";
import "./Signup.scss";
import useSignupPreviewAccount from "./hooks/useSignupPreviewAccount";
import { EnumPreviewAccountType } from "../models";
import { AnimationType, FullScreenLoader } from "@amplication/ui/design-system";

const SignupPreviewAccount = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const previewAccountTypeParam = urlParams.get("previewAccountType");
  const emailParam = urlParams.get("email");
  const email = emailParam.replace(/ /g, "+");

  const { loading, error } = useSignupPreviewAccount(
    email,
    EnumPreviewAccountType[previewAccountTypeParam]
  );

  const errorMessage = formatError(error);

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {loading && <FullScreenLoader animationType={AnimationType.Full} />}
    </>
  );
};

export default SignupPreviewAccount;
