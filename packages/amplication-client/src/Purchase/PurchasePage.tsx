import { StiggProvider, Paywall } from "@stigg/react-sdk";
import { Modal } from "@amplication/design-system";
import "./PurchasePage.scss";
import axios from "axios";
import { REACT_APP_BILLING_API_KEY, REACT_APP_SERVER_URI } from "../env";
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
          <div className={`${CLASS_NAME}__first_line`}>
            Pick the perfect plan for your needs
          </div>
          <WorkspaceList
            selectedWorkspace={purchaseWorkspace}
            onWorkspaceSelected={handleSetCurrentWorkspace}
          ></WorkspaceList>
        </div>
        <StiggProvider
          apiKey={REACT_APP_BILLING_API_KEY}
          customerId={purchaseWorkspace.id}
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
    </Modal>
  );
};

export default PurchasePage;
