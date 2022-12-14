import warning from "../assets/images/warning.svg";
import "./NotFoundPage.scss";
import PageContent from "../Layout/PageContent";

const CLASS_NAME = "not-found-page";

const pageTitle = "Not Found";

const NotFound = () => {
  return (
    <PageContent pageTitle={pageTitle} className={CLASS_NAME}>
      <img src={warning} alt="warning" />
      <h1>Not Found | 404</h1>
      <h2>Oops! Looks like this page doesn't exist.</h2>
    </PageContent>
  );
};

export default NotFound;
