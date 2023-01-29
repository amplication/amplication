import { LoaderTiny, Modal } from "@amplication/design-system";
import "./PurchaseLoader.scss";

const CLASS_NAME = "purchase-loader";

export const PurchaseLoader = () => {
  return (
    <Modal open css={CLASS_NAME} fullScreen={false}>
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__spinner`}>
          <LoaderTiny />
        </div>
        <div className={`${CLASS_NAME}__content__text`}>
          Initiating checkout...
        </div>
      </div>
    </Modal>
  );
};
