import { Question } from "./Question";

import "./FAQ.scss";

const CLASS_NAME = "faq";

const MailTo = ({ email, subject, body }) => {
  return (
    <a className="mail-link" href={`mailto:${email}?subject=${subject}`}>
      {body}
    </a>
  );
};

export const FAQ = () => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>FAQ</div>
      <div className={`${CLASS_NAME}__list`}>
        <Question
          question="How does Amplication pricing work?"
          answer="Amplication offers a Free edition for individual developers or small teams. There's also an Enterprise edition for larger organizational needs with advanced security features, additional git sync providers, and more features."
        />
        <Question
          question="What plan is best for me and my team?"
          answer="The Enterprise edition is designed for larger organizations that need more features, while the free edition is suitable for individual developers or small teams."
        />
        <Question
          question="What are the differences between the free and the enterprise tier?"
          answer="The Free edition includes database and model management, role-based permissions, and both GraphQL & REST API support. The Enterprise edition adds advanced security features, additional git sync providers, dedicated support, and includes SSO."
        />
        <Question
          question="We have multiple teams in the organization, can we use one account to manage separate teams?"
          answer=""
        />
        <Question
          question="We are working with the enterprise edition of GitLab / BitBucket, will it work with Amplication?"
          answer="Amplication currently supports GitHub for the Free Plan and Bitbucket, AWS CodeCommit for the Enterprise Plan, with plans to add more git providers in the future."
        />
        <Question
          question="We have our own best practices and standards - can we ask Amplication to generate the code in our own flavor?"
          answer={
            <div>
              Amplication offers a structured way to add custom code and modify
              your generated code, but it still adheres to its core architecture
              and coding patterns.
              <br />
              <br />
              We provide guides on how to add actions to REST API controllers,
              add custom DTOs (Data Transfer Objects), add queries to GraphQL
              resolver, and more on our documentation.
            </div>
          }
        />
        <Question
          question="Do you support more languages besides TypeScript and Node.js?"
          answer="Right now Amplication is focused on helping you generate production-ready Node.js backends. At the moment we don't support other languages."
        />
        <Question
          question="We have legacy systems, and would like to progress to modern architecture. Can you assist with it?"
          answer={
            <div>
              Amplication can faciliate the modernization of your legacy system.
              We offer a suite of tools and features designed to streamline this
              process. Those capabilities include:
              <br />
              <ul>
                <li>
                  <strong>DB Schema Import</strong>: Simplify the migration of
                  extensive legacy data into new systems, preserving the
                  integrity and structure of historical data.
                </li>
                <li>
                  <strong>Data Modeling & Event Brokering</strong>: Enables the
                  transition from monolithic architectures to microservices,
                  allowing for the creation of scalable and manageable backends.
                </li>
                <li>
                  <strong>Customizable Code Generation</strong>: Ensures
                  flexibility in development, allowing for specific
                  customizations without being bound to rigid system
                  constraints.
                </li>
              </ul>
            </div>
          }
        />
        <Question
          question="Can you assist with the actual deployment (terraform-like) in a cloud provider?"
          answer={
            <div>
              Amplication allows you to deploy to AWS's Elastic Container
              Service (ECS). We provide in-depth documentation that will walk
              you through using various Amplication plugins to provision the
              required infrastructure and set up a process for continuous
              integration and deployment.
              <br />
              <br />
              The steps cover manual configurations for permissions and
              authentication, plugin settings for AWS services, code generation,
              provisioning with Terraform, and deployment using GitHub Actions.
            </div>
          }
        />
        <Question
          question="I have an existing DB with a lot of data, entities, tables, and relationships. Can I use your backend development platform, while still keeping the data and the knowledge?"
          answer="Amplication's DB Schema Import feature provides a clear pathway for integrating an existing database with the Amplication platform. The import feature is available on all Amplication plans, including Free accounts."
        />
        <Question
          question="Will your generated code override my code changes?"
          answer={
            <div>
              Amplication's Smart Git Sync feature ensures that changes made in
              an Amplication project are automatically tracked and committed to
              a dedicated branch in the connected Git repository. The system is
              designed to manage the syncing process efficiently, automatically
              creating commits and pull requests with clear messages that
              reflect the changes made.
              <br />
              <br />
              Your changes will not get overriden until you have merged any new
              changes from Amplication.
            </div>
          }
        />
        <Question
          question="Due to security regulations, my enterprise require supporting relevant capabilities, like 2FA, audit log, SSO and more. Do you support it?"
          answer="The Enterprise edition gives you access to advanced security features like SSO and audit logs are provided."
        />
        <Question
          question="Can I pay to Amplication through my AWS account (AWS billing)?"
          answer=""
        />
      </div>
    </div>
  );
};
