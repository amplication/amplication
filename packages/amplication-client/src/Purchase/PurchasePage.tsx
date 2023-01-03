import { StiggProvider, Paywall } from "@stigg/react-sdk";
import { Button, EnumButtonStyle, Modal } from "@amplication/design-system";
import "./PurchasePage.scss";
import axios from "axios";
import { REACT_APP_BILLING_API_KEY, REACT_APP_SERVER_URI } from "../env";
import { PromoBanner } from "./PromoBanner";
import { useCallback, useContext, useState } from "react";
import * as models from "../models";
import { AppContext } from "../context/appContext";
import WorkspaceList from "../Workspaces/WorkspaceList";

const CLASS_NAME = "purchase-page";

const PurchasePage = (props) => {
  const { currentWorkspace } = useContext(AppContext);

  const [purchaseWorkspace, setPurchaseWorkspace] =
    useState<models.Workspace>(currentWorkspace);

  const handleSetCurrentWorkspace = useCallback(
    (workspace: models.Workspace) => {
      setPurchaseWorkspace(workspace);
    },
    [setPurchaseWorkspace]
  );

  return (
    <Modal open fullScreen>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          Pick the perfect plan for your needs
        </div>
        <WorkspaceList
          selectedWorkspace={purchaseWorkspace}
          onWorkspaceSelected={handleSetCurrentWorkspace}
        />
        <StiggProvider
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
            onPlanSelected={async ({ plan, customer }) => {
              const resp = await axios.post(
                `${REACT_APP_SERVER_URI}/billing/provisionSubscription`,
                {
                  workspaceId: purchaseWorkspace.id,
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
