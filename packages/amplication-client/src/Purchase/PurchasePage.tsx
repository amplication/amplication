import { StiggProvider, Paywall, BillingPeriod } from "@stigg/react-sdk";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import * as models from "../models";
import { useHistory } from "react-router-dom";
import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
} from "@amplication/design-system";
import axios from "axios";
import { REACT_APP_BILLING_API_KEY, REACT_APP_SERVER_URI } from "../env";
import "./PurchasePage.scss";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import WorkspaceList from "../Workspaces/WorkspaceList";
import { PromoBanner } from "./PromoBanner";

const selectedPlanAction = {
  "plan-amplication-enterprise": (
    props,
    purchaseWorkspace,
    selectedBillingPeriod,
    isLowerThanCurrentPlan
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
    isLowerThanCurrentPlan
  ) => {
    const resp = await axios.post(
      `${REACT_APP_SERVER_URI}/billing/provisionSubscription`,
      {
        workspaceId: purchaseWorkspace.id,
        planId: "plan-amplication-pro",
        billingPeriod: selectedBillingPeriod,
        isLowerThanCurrentPlan,
        successUrl: props.location.state.from.pathname,
        cancelUrl: props.location.state.from.pathname,
      }
    );

    const checkoutResult = resp.data;
    if (checkoutResult.provisionStatus === "PaymentRequired") {
      window.location.href = checkoutResult.checkoutUrl;
    }
  },
};

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  const { trackEvent } = useTracking();
  const history = useHistory();
  const backUrl = () => {
    if (history.location.search === "?u=p") return history.push("/");

    history.action !== "POP" ? history.goBack() : history.push("/");
  };
  const { currentWorkspace } = useContext(AppContext);

  const [purchaseWorkspace, setPurchaseWorkspace] =
    useState<models.Workspace>(currentWorkspace);

  const handleSetCurrentWorkspace = useCallback(
    (workspace: models.Workspace) => {
      setPurchaseWorkspace(workspace);
      trackEvent({
        eventName: AnalyticsEventNames.PricingPageChangeWorkspace,
        workspace: workspace.id,
      });
    },
    [setPurchaseWorkspace]
  );

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
        <WorkspaceList
          selectedWorkspace={purchaseWorkspace}
          onWorkspaceSelected={handleSetCurrentWorkspace}
        />
        <StiggProvider
          key={purchaseWorkspace.id}
          apiKey={REACT_APP_BILLING_API_KEY}
          customerId={purchaseWorkspace.id}
        >
          <PromoBanner />
          <Paywall
            textOverrides={{
              entitlementsTitle: (plan) => {
                return plan.basePlan
                  ? `Everything in ${plan.basePlan.displayName} plan, plus:`
                  : `All core backend functionality:`;
              },
              planCTAButton: {
                startNew: "Upgrade now",
                upgrade: "Upgrade now",
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
              console.log(plan.isLowerThanCurrentPlan);
              trackEvent({
                eventName: AnalyticsEventNames.PricingPageCTAClick,
                currentPlan: plan.basePlan.displayName,
                type: plan.displayName,
                action: intentionType,
                Billing: selectedBillingPeriod,
              });
              selectedPlanAction[plan.id](
                props,
                purchaseWorkspace,
                selectedBillingPeriod,
                isLowerThanCurrentPlan
              );
            }}
          />
        </StiggProvider>
      </div>
      <div className={`${CLASS_NAME}__contact`}>
        <div className={`${CLASS_NAME}__contact_content`}>
          <p>Building an open-source project?</p>
          <label>
            Let us know if there is anything we can support you with. We will do
            our best to help you improve your project for the community!
          </label>
        </div>
        <div className={`${CLASS_NAME}__contact_btn`}>
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
      </div>
    </Modal>
  );
};

export default PurchasePage;
