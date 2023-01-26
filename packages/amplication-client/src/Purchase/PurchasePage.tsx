import { Paywall, BillingPeriod } from "@stigg/react-sdk";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { Link, useHistory } from "react-router-dom";
import * as models from "../models";
import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
} from "@amplication/design-system";
import "./PurchasePage.scss";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { PromoBanner } from "./PromoBanner";
import { ApolloError, useMutation } from "@apollo/client";
import { PROVISION_SUBSCRIPTION } from "../Workspaces/queries/workspaceQueries";

export type DType = {
  provisionSubscription: models.ProvisionSubscriptionResult;
};

const selectedPlanAction = {
  "plan-amplication-enterprise": (
    props,
    purchaseWorkspace,
    selectedBillingPeriod,
    intentionType,
    provisionSubscription
  ) => {
    window.open(
      "mailto:sales@amplication.com?subject=Enterprise Plan Inquiry",
      "_blank",
      "noreferrer"
    );
  },
  "plan-amplication-pro": async (
    props,
    purchaseWorkspace,
    selectedBillingPeriod,
    intentionType,
    provisionSubscription
  ) => {
    provisionSubscription({
      variables: {
        data: {
          workspaceId: purchaseWorkspace.id,
          planId: "plan-amplication-pro",
          billingPeriod: selectedBillingPeriod,
          intentionType,
          successUrl: props.location.state?.from?.pathname,
          cancelUrl: props.location.state?.from?.pathname,
        },
      },
    });
  },
};

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  const { trackEvent } = useTracking();
  const history = useHistory();
  const backUrl = () => {
    if (history.location.state && history.location.state.source)
      return history.push("/");

    history.action !== "POP" ? history.goBack() : history.push("/");
  };
  const { currentWorkspace } = useContext(AppContext);
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

  return (
    <Modal open fullScreen>
      <div className={CLASS_NAME}>
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
          onPlanSelected={async ({
            plan,
            intentionType,
            selectedBillingPeriod,
          }) => {
            trackEvent({
              eventName: AnalyticsEventNames.PricingPageCTAClick,
              currentPlan: plan.basePlan.displayName,
              type: plan.displayName,
              action: intentionType,
              Billing: selectedBillingPeriod,
            });
            selectedPlanAction[plan.id](
              props,
              currentWorkspace,
              selectedBillingPeriod,
              intentionType,
              provisionSubscription
            );
          }}
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
          <Button buttonStyle={EnumButtonStyle.Primary}>
            <a
              target="_blank"
              rel="noreferrer"
              className={`${CLASS_NAME}__contact_pro_btn`}
              href="mailto:sales@amplication.com?subject=Pro plan for Open Source project"
            >
              Contact us
            </a>
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
