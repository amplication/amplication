import { StiggProvider, Paywall } from "@stigg/react-sdk";

import { Button, EnumButtonStyle, Modal } from "@amplication/design-system";

import "./PurchasePage.scss";
import axios from "axios";
import { REACT_APP_BILLING_API_KEY, REACT_APP_SERVER_URI } from "../env";

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  return (
    <Modal open fullScreen>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          Pick the perfect plan for your needs
        </div>
        <StiggProvider
          apiKey={REACT_APP_BILLING_API_KEY}
          customerId={props.match.params.workspace}
        >
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
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            //onClick={handleBackToProjectClick}
          >
            {"Contact us"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchasePage;
