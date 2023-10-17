import { Paywall, BillingPeriod, Price } from "@stigg/react-sdk";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as models from "../models";
import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
} from "@amplication/ui/design-system";
import "./PurchasePage.scss";
import { useCallback, useContext, useState } from "react";

import { AppContext } from "../context/appContext";
import { PromoBanner } from "./PromoBanner";
import { ApolloError, useMutation } from "@apollo/client";
import { PROVISION_SUBSCRIPTION } from "../Workspaces/queries/workspaceQueries";
import { PurchaseLoader } from "./PurchaseLoader";
import { FAQ } from "./FAQ";

export type DType = {
  provisionSubscription: models.ProvisionSubscriptionResult;
};

type PriceParam = { price: number; currency: string };

const UNKNOWN = "unknown";

const getPlanPrice = (
  selectedBillingPeriod: BillingPeriod,
  pricePoints: Price[]
): PriceParam => {
  const unknownPrice: PriceParam = { currency: UNKNOWN, price: 0 };

  // If there are no price points, return the unknown price
  if (!pricePoints.length) {
    return unknownPrice;
  }

  // Return the price point with the selected billing period
  return pricePoints.reduce(
    (price: PriceParam, pricePoint: Price): PriceParam => {
      if (pricePoint.billingPeriod === selectedBillingPeriod) {
        price = { currency: pricePoint.currency, price: pricePoint.amount };
      }
      return price;
    },
    unknownPrice
  );
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
        if (provisionStatus === "PAYMENT_REQUIRED")
          window.location.href = checkoutUrl;
      },
      onError: (error: ApolloError) => {
        console.log(error);
      },
    });

  const handleContactUsClick = useCallback(() => {
    // This query param is used to open HubSpot chat with the main flow
    history.push("?contact-us=true");
    openHubSpotChat();
    trackEvent({
      eventName: AnalyticsEventNames.ContactUsButtonClick,
      Action: "Contact Us",
      workspaceId: currentWorkspace.id,
    });
  }, [openHubSpotChat, currentWorkspace.id]);

  const handleDowngradeClick = useCallback(() => {
    // This query param is used to open HubSpot chat with the downgrade flow
    history.push("?downgrade=true");
    openHubSpotChat();
  }, [openHubSpotChat]);

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
      const { currency, price } = getPlanPrice(
        selectedBillingPeriod,
        plan.pricePoints
      );

      trackEvent({
        eventName: AnalyticsEventNames.PricingPageCTAClick,
        currentPlan:
          currentWorkspace.subscription || models.EnumSubscriptionPlan.Free,
        price,
        type: plan.displayName,
        action: intentionType,
        Billing: selectedBillingPeriod,
        currency,
      });
      switch (plan.id) {
        case "plan-amplication-enterprise":
          handleContactUsClick();
          break;
        case "plan-amplication-pro":
          setLoading(true);
          await upgradeToPro(selectedBillingPeriod, intentionType);
          break;
        case "plan-amplication-free":
          handleDowngradeClick();
          break;
      }
    },
    [upgradeToPro, handleContactUsClick]
  );

  const pageTitle = "Pricing & Plans";

  return (
    <Modal open fullScreen>
      <Helmet>
        <title>{`Amplication | ${pageTitle} : `}</title>
      </Helmet>
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
          preferredBillingPeriod={BillingPeriod.Monthly}
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
        <FAQ />
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
