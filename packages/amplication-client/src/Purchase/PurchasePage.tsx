import { Paywall, BillingPeriod, Price } from "@stigg/react-sdk";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useHistory } from "react-router-dom";
import * as models from "../models";
import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
} from "@amplication/design-system";
import "./PurchasePage.scss";
import { useCallback, useContext, useState } from "react";

import { AppContext } from "../context/appContext";
import { PromoBanner } from "./PromoBanner";
import { ApolloError, useMutation } from "@apollo/client";
import { PROVISION_SUBSCRIPTION } from "../Workspaces/queries/workspaceQueries";
import { PurchaseLoader } from "./PurchaseLoader";

export type DType = {
  provisionSubscription: models.ProvisionSubscriptionResult;
};

const UNKNOWN = "unknown";

const getPlanPrice = (
  selectedBillingPeriod: BillingPeriod,
  pricePoints: Price[]
) => {
  if (!pricePoints.length) return UNKNOWN;

  return pricePoints.reduce((price: string, pricePoint: Price) => {
    if (pricePoint.billingPeriod === selectedBillingPeriod)
      price = `${pricePoint.amount}${pricePoint.currency}`;

    return price;
  }, UNKNOWN);
};

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  const { currentWorkspace, openHubSpotChat } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const history = useHistory();
  const backUrl = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.PricingPageClose,
    });
    if (history.location.state && history.location.state.source)
      return history.push("/");

    history.action !== "POP" ? history.goBack() : history.push("/");
  }, [history]);

  const [provisionSubscription, { loading: provisionSubscriptionLoading }] =
    useMutation<DType>(PROVISION_SUBSCRIPTION, {
      onCompleted: (data) => {
        const { provisionStatus, checkoutUrl } = data.provisionSubscription;
        if (provisionStatus === "PaymentRequired")
          window.location.href = checkoutUrl;
      },
      onError: (error: ApolloError) => {
        console.log(error);
      },
    });

  const handleContactUsClick = useCallback(() => {
    openHubSpotChat();
    trackEvent({
      eventName: AnalyticsEventNames.ContactUsButtonClick,
      Action: "Contact Us",
      workspaceId: currentWorkspace.id,
    });
  }, [openHubSpotChat, currentWorkspace.id]);

  const [isLoading, setLoading] = useState(false);

  const upgradeToPro = useCallback(
    async (selectedBillingPeriod, intentionType) => {
      await provisionSubscription({
        variables: {
          data: {
            workspaceId: currentWorkspace.id,
            planId: "plan-amplication-pro",
            billingPeriod: selectedBillingPeriod,
            intentionType,
            successUrl: props.location.state?.from?.pathname,
            cancelUrl: props.location.state?.from?.pathname,
          },
        },
      });
    },
    [props.location.state, provisionSubscription, currentWorkspace.id]
  );

  const onPlanSelected = useCallback(
    async ({ plan, intentionType, selectedBillingPeriod }) => {
      trackEvent({
        eventName: AnalyticsEventNames.PricingPageCTAClick,
        currentPlan: currentWorkspace.subscription || "Free",
        type: plan.displayName,
        price: getPlanPrice(selectedBillingPeriod, plan.pricePoints),
        action: intentionType,
        Billing: selectedBillingPeriod,
      });
      switch (plan.id) {
        case "plan-amplication-enterprise":
          handleContactUsClick();
          break;
        case "plan-amplication-pro":
          setLoading(true);
          await upgradeToPro(selectedBillingPeriod, intentionType);
          break;
      }
    },
    [upgradeToPro, handleContactUsClick]
  );

  return (
    <Modal open fullScreen>
      <div className={CLASS_NAME}>
        {isLoading && <PurchaseLoader />}
        <div className={`${CLASS_NAME}__layout`}>
          <Button
            className={`${CLASS_NAME}__layout__btn`}
            buttonStyle={EnumButtonStyle.Outline}
            icon={"arrow_left"}
            iconPosition={EnumIconPosition.Left}
            onClick={backUrl}
          >
            Back
          </Button>
        </div>
        <div className={`${CLASS_NAME}__header`}>
          Pick the perfect plan for your needs
        </div>
        <PromoBanner />
        <Paywall
          textOverrides={{
            entitlementsTitle: (plan) => {
              return plan.basePlan
                ? `Everything in ${plan.basePlan.displayName} plan, plus:`
                : `All core backend functionality:`;
            },
            planCTAButton: {
              startNew: provisionSubscriptionLoading
                ? "...Loading"
                : "Upgrade now",
              upgrade: provisionSubscriptionLoading
                ? "...Loading"
                : "Upgrade now",
              custom: "Contact us",
            },
            price: {
              free: {
                price: "$0",
                unit: "",
              },
              custom: "Contact Us",
              priceNotSet: "Price not set",
            },
          }}
          onBillingPeriodChange={(billingPeriod: BillingPeriod) => {
            trackEvent({
              eventName: AnalyticsEventNames.PricingPageChangeBillingCycle,
              action: billingPeriod,
            });
          }}
          onPlanSelected={onPlanSelected}
        />
        <div className={`${CLASS_NAME}__contact`}>
          <div className={`${CLASS_NAME}__contact__content`}>
            <div className={`${CLASS_NAME}__contact__content__header`}>
              Building an open-source project?
            </div>
            <div className={`${CLASS_NAME}__contact__content__description`}>
              Let us know if there is anything we can support you with. We will
              do our best to help you improve your project for the community!
            </div>
          </div>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleContactUsClick}
          >
            Contact Us
          </Button>
        </div>
        <div className={`${CLASS_NAME}__footer`}>
          <div className={`${CLASS_NAME}__footer__copyright`}>
            ©2022 amplication
          </div>
          <div className={`${CLASS_NAME}__footer__links`}>
            <a
              href="https://amplication.com/privacy-policy"
              className={`${CLASS_NAME}__footer__links__privacy`}
            >
              Privacy Policy
            </a>
            <a
              href="https://amplication.com/terms"
              className={`${CLASS_NAME}__footer__links__terms`}
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchasePage;
