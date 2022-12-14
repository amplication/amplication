import warning from "../assets/images/warning.svg";
import "./NotFoundPage.scss";
import PageContent from "../Layout/PageContent";

const CLASS_NAME = "not-found-page";

const pageTitle = "Not Found";

const NotFound = () => {
  return (
    <PageContent pageTitle={pageTitle} className={CLASS_NAME}>
      <h1>
        <img
          src={warning}
          alt="warning"
          className="warning"
          data-testid="warning"
        />
        404 | Not Found
      </h1>
      <h2>Oops! It looks like this page doesn't exist.</h2>
    </PageContent>
  );
};

export default NotFound;
