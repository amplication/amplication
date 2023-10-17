import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import useLocalStorage from "react-use-localstorage";

import { LOCAL_STORAGE_KEY_COUPON_CODE } from "../App";
import { Dialog, PlanUpgradeConfirmation } from "@amplication/ui/design-system";
import { formatError } from "../util/error";
import * as models from "../models";

type TData = {
  redeemCoupon: models.Coupon;
};

const couponContent: {
  [key: string]: {
    title: string;
    subTitle: string;
    message: string;
    ctaText: string;
    imageUrl: string;
    imageAlt: string;
  };
} = {
  "hacktoberfest-2023": {
    title: "Congratulations!",
    subTitle: "You have successfully redeemed your Hacktoberfest coupon",
    message: "We appreciate your open-source contribution.",
    ctaText: "Let's start building",
    imageUrl:
      "https://raw.githubusercontent.com/amplication/public-assets/main/coupons/hacktoberfest-2023.png",
    imageAlt: "Hacktoberfest 2023",
  },
};

/**
 * Looks for coupon code in local storage, and send a redeemCoupon request to the server
 */
const RedeemCoupon = () => {
  const history = useHistory();
  const [couponCode, setCouponCode] = useLocalStorage(
    LOCAL_STORAGE_KEY_COUPON_CODE,
    undefined
  );

  const [redeemStarted, setRedeemStarted] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const onConfirmation = useCallback(() => {
    setShowConfirmation(false);
    history.replace("/");
    window.location.reload();
  }, []);

  const [redeemCoupon, { data, loading, error }] = useMutation<TData>(
    REDEEM_COUPON,
    {
      onCompleted: (data) => {
        setCouponCode("");
        setShowConfirmation(true);
      },
      onError: (error) => {
        setCouponCode("");
        setShowError(true);
      },
    }
  );

  useEffect(() => {
    if (!isEmpty(couponCode) && !loading && !redeemStarted) {
      setRedeemStarted(true);
      redeemCoupon({
        variables: {
          code: couponCode,
        },
      }).catch(console.error);
    }
  }, [couponCode, history, redeemCoupon, loading]);

  const errorMessage = error && formatError(error);

  const content = couponContent[data?.redeemCoupon?.couponType];

  if (showError) {
    return (
      <Dialog
        title="Error redeeming coupon"
        isOpen={showError}
        onDismiss={() => setShowError(false)}
        showCloseButton={true}
      >
        {errorMessage}
      </Dialog>
    );
  }

  return !showConfirmation ? null : (
    <PlanUpgradeConfirmation
      isOpen={showConfirmation}
      onConfirm={onConfirmation}
      onDismiss={onConfirmation}
      {...content}
      graphics={
        content?.imageUrl && (
          <img src={content.imageUrl} alt={content.imageAlt} />
        )
      }
    />
  );
};

export default RedeemCoupon;

const REDEEM_COUPON = gql`
  mutation redeemCoupon($code: String!) {
    redeemCoupon(data: { code: $code }) {
      id
      couponType
      durationMonths
      code
    }
  }
`;
