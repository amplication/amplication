import { formatError } from "../util/error";
import "./Signup.scss";
import useSignupPreviewAccount from "./hooks/useSignupPreviewAccount";
import { EnumPreviewAccountType } from "../models";
import { lazy } from "react";

//use specific import path to prevent inclusion of all the design-system CSS in the main bundle
import { AnimationType } from "@amplication/ui/design-system/components/Loader/Loader";

//use lazy loading imports to prevent inclusion of the components CSS in the main bundle
const FullScreenLoader = lazy(
  () =>
    import("@amplication/ui/design-system/components/Loader/FullScreenLoader")
);

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
