import { useStiggContext } from "@stigg/react-sdk";
import { useEffect, useState } from "react";
import "./PromoBanner.scss";

const CLASS_NAME = "promo-banner";

export const PromoBanner = () => {
  const [isFreePlan, setFreePlan] = useState(false);

  const { stigg, isInitialized } = useStiggContext();

  useEffect(() => {
    async function getCustomer() {
      if (isInitialized) {
        const customer = await stigg.getCustomer();
        const subs = customer.getActiveSubscriptions();
        setFreePlan(
          subs.some((sub) => sub.plan.id === "plan-amplication-free")
        );
      }
    }
    getCustomer();
  }, [isInitialized]);

  return (
    isFreePlan && (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__content`}>
          <div className={`${CLASS_NAME}__content__label`}>
            <div className={`${CLASS_NAME}__content__label__text`}>
              Limited time offer
            </div>
          </div>
          <div className={`${CLASS_NAME}__content__title`}>
            Thank you for being an early adopter
          </div>
          <div className={`${CLASS_NAME}__content__description`}>
            As a token of appreciation we offer you two month of our Pro plan
          </div>
          <div className={`${CLASS_NAME}__content__free`}>FOR FREE</div>
          <div className={`${CLASS_NAME}__content__coupon`}>
            <div className={`${CLASS_NAME}__content__coupon__label`}>
              Use coupon code:
            </div>
            <div className={`${CLASS_NAME}__content__coupon__code`}>EARLY2</div>
          </div>
        </div>
      </div>
    )
  );
};
