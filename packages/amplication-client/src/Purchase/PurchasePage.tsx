import { StiggProvider, Paywall } from "@stigg/react-sdk";
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

const selectedPlanAction = {
  "plan-amplication-enterprise": () => {
    window.open(
      "mailto:sales@amplication.com?subject=Enterprise Plan Inquiry",
      "_blank",
      "noreferrer"
    );
  },
  "plan-amplication-pro": async (props) => {
    const resp = await axios.post(
      `${REACT_APP_SERVER_URI}/billing/provisionSubscription`,
      {
        workspaceId: props.match.params.workspace,
        planId: "plan-amplication-pro",
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
  const history = useHistory();
  const backUrl = () =>
    history.action !== "POP" ? history.goBack() : history.push("/");

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
            back
          </Button>
        </div>
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
            onPlanSelected={async ({ plan, customer }) =>
              selectedPlanAction[plan.id]()
            }
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
