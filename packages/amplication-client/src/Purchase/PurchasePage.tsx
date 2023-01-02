import { StiggProvider, Paywall } from "@stigg/react-sdk";

import { Modal } from "@amplication/design-system";

import "./PurchasePage.scss";
import axios from "axios";
import { REACT_APP_BILLING_API_KEY, REACT_APP_SERVER_URI } from "../env";
import { PromoBanner } from "./PromoBanner";

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  return (
    <Modal open fullScreen>
      <StiggProvider
        apiKey={REACT_APP_BILLING_API_KEY}
        customerId={props.match.params.workspace}
      >
        <div className={CLASS_NAME}>
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
            onPlanSelected={async ({ plan, customer }) => {
              const resp = await axios.post(
                `${REACT_APP_SERVER_URI}/billing/provisionSubscription`,
                {
                  workspaceId: props.match.params.workspace,
                  planId: plan.id,
                  successUrl: props.location.state.from.pathname,
                  cancelUrl: props.location.state.from.pathname,
                }
              );

              const checkoutResult = resp.data;
              if (checkoutResult.provisionStatus === "PaymentRequired") {
                window.location.href = checkoutResult.checkoutUrl;
              }
            }}
          />
        </div>
      </StiggProvider>
    </Modal>
  );
};

export default PurchasePage;
