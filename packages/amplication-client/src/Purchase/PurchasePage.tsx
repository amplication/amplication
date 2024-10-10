import { BillingPlan } from "@amplication/util-billing-types";
import { BillingPeriod, Paywall, Price } from "@stigg/react-sdk";

import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./PurchasePage.scss";

import { ApolloError, useMutation } from "@apollo/client";
import { useContactUs } from "../Workspaces/hooks/useContactUs";
import { PROVISION_SUBSCRIPTION } from "../Workspaces/queries/workspaceQueries";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { FAQ } from "./FAQ";
import { PromoBanner } from "./PromoBanner";
import { PurchaseLoader } from "./PurchaseLoader";
import { REACT_APP_PREFER_MONTHLY_CHECKOUT } from "../env";

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
  const [provisionErrorMessage, setProvisionErrorMessage] = useState<
    string | null
  >(null);
  const { handleContactUsClick } = useContactUs({
    actionName: "Contact Us",
    eventOriginLocation: "pricing-page",
  });

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

  const [
    provisionSubscription,
    {
      loading: provisionSubscriptionLoading,
      error: provisionSubscriptionError,
    },
  ] = useMutation<DType>(PROVISION_SUBSCRIPTION, {
    onCompleted: (data) => {
      const { provisionStatus, checkoutUrl } = data.provisionSubscription;
      if (provisionStatus === "PAYMENT_REQUIRED") {
        window.location.href = checkoutUrl;
      } else if (provisionStatus === "SUCCESS") {
        setLoading(false);
      } else {
        setLoading(false);
        setProvisionErrorMessage(
          "Failed to provision subscription. Please try again or contact us for support."
        );
      }
    },
    onError: (error: ApolloError) => {
      setLoading(false);
      console.log(error);
    },
  });

  const errorMessage =
    provisionSubscriptionError && formatError(provisionSubscriptionError);

  const returnUrl =
    props.location.state?.from?.pathname || `/${currentWorkspace?.id}`;

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
            planId: BillingPlan.Essential,
            billingPeriod: selectedBillingPeriod,
            intentionType,
            successUrl: returnUrl,
            cancelUrl: returnUrl,
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
        case BillingPlan.Enterprise:
          handleContactUsClick();
          break;
        case BillingPlan.Essential:
        case BillingPlan.Team:
          setLoading(true);
          await upgradeToPro(selectedBillingPeriod, intentionType);
          break;
        case BillingPlan.Free:
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
                ? `Backend standardization and optimization:`
                : `Code generation functionality:`;
            },
            planCTAButton: {
              startTrial: () => "Upgrade now", //essential for existing users starts without a trial
              startNew: provisionSubscriptionLoading
                ? "...Loading"
                : "Upgrade now",
              upgrade: provisionSubscriptionLoading
                ? "...Loading"
                : "Upgrade now",
              custom: "Book a Demo",
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
          preferredBillingPeriod={
            REACT_APP_PREFER_MONTHLY_CHECKOUT === "true"
              ? BillingPeriod.Monthly
              : BillingPeriod.Annually
          }
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
        <div className={`${CLASS_NAME}__faq`}>
          <FAQ />
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
      <Snackbar
        open={
          Boolean(provisionSubscriptionError) || Boolean(provisionErrorMessage)
        }
        message={errorMessage || provisionErrorMessage}
      />
    </Modal>
  );
};

export default PurchasePage;
