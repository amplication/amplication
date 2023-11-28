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
          answer={
            <div>
              Amplication offers two primary plans. The{" "}
              <strong>Free plan</strong> is for individual developers or small
              teams building small-scale applications. It provides core features
              to get you started on your projects.
              <br />
              For larger organizations with more complex needs, our{" "}
              <strong>Enterprise plan</strong> is the best fit. It includes
              advanced security features, additional git sync providers, and
              many more features listed in the pricing table above.
              <br />
              For a full breakdown of the Enterprise plan's capabilities and to
              get a personalized quote, feel free to contact us.
            </div>
          }
        />
        <Question
          question="What plan is best for me and my team?"
          answer={
            <div>
              <strong>Free plan</strong>: Awesome for individuals or businesses
              building small-scale applications, offering essential features to
              kickstart your project.
              <br />
              <strong>Enterprise plan</strong>: The ideal choice if you're
              focused on building scalable, modern applications and require
              advanced features.
              <br />
              To help you decide, check out our available plans on this page,
              where you'll find a detailed comparison to ensure you pick the
              plan that best suits your team's needs.
            </div>
          }
        />
        <Question
          question="What are the differences between the free and the enterprise tier?"
          answer={
            <div>
              The Free plan includes database and model management, role-based
              permissions, and both GraphQL & REST API support.
              <br></br>
              The Enterprise plan adds unlimited projects, unlimited services,
              unlimited team members, advanced security features, additional git
              sync providers, dedicated support, and includes SSO.
            </div>
          }
        />
        <Question
          question="Due to security regulations, my enterprise require supporting relevant capabilities, like 2FA, audit log, SSO and more. Do you support it?"
          answer="The Enterprise edition gives you access to advanced security features like SSO and audit logs are provided."
        />
        <Question
          question="We have multiple teams in the organization, can we use one account to manage separate teams?"
          answer="Yes, the Enterprise plan lets you have unlimited projects, services, and team members. You can manage all your teams from the same organization in your preferred structure."
        />
        <Question
          question="We are working with the enterprise edition of GitLab / BitBucket, will it work with Amplication?"
          answer={
            <div>
              Amplication's compatibility with git providers varies based on the
              plan:
              <ul>
                <li>
                  <strong>Free Plan:</strong> Supports GitHub.
                </li>
                <li>
                  <strong>Enterprise Plan:</strong> Supports Bitbucket, AWS
                  CodeCommit, and GitLab.
                </li>
              </ul>
              We have to plans to add more git providers in the future.
            </div>
          }
        />

        <Question
          question="We have our own best practices and standards - can we ask Amplication to generate the code in our own flavor?"
          answer={
            <div>
              Amplication offers a structured way to{" "}
              <a href="https://docs.amplication.com/custom-code/">
                add custom code
              </a>{" "}
              and modify your generated code.
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
              process. Those capabilities include:{" "}
              <a href="https://docs.amplication.com/how-to/import-prisma-schema/">
                DB Schema Import
              </a>
              ,{" "}
              <a href="https://docs.amplication.com/how-to/create-entity/">
                Data Modeling
              </a>{" "}
              &{" "}
              <a href="https://docs.amplication.com/plugins-list/#apache-kafka">
                Event Brokering
              </a>
              , and{" "}
              <a href="https://docs.amplication.com/custom-code/">
                Customizable Code Generation
              </a>
              .
            </div>
          }
        />
        <Question
          question="Can you assist with deploying to various cloud providers like AWS?"
          answer={
            <div>
              Yes, Amplication provides in-depth guides that show you how to
              deploy to services like{" "}
              <a href="https://docs.amplication.com/deploy/kubernetes/">
                Kubernetes
              </a>
              ,{" "}
              <a href="https://docs.amplication.com/deploy/docker-desktop/">
                Docker Desktop
              </a>
              ,{" "}
              <a href="https://docs.amplication.com/deploy/aws/ecs/">
                AWS's ECS
              </a>
              , and more coming soon.
            </div>
          }
        />
        <Question
          question="I have an existing DB with a lot of data, entities, tables, and relationships. Can I use your backend development platform, while still keeping the data and the knowledge?"
          answer="Amplication's DB Schema Import feature provides a clear pathway for integrating an existing database with the Amplication platform. The import feature is available on Amplication's Enterprise plan."
        />
        <Question
          question="Will your generated code override my code changes?"
          answer={
            <div>
              Yes, Amplication's Smart Git Sync feature ensures that your custom
              code always takes precedence over the generated code. Our system
              intelligently combines both, managing the syncing process
              efficiently. This means that your changes will not be overridden
              and will be seamlessly integrated with any new changes from
              Amplication. For more details on how this works, please refer to
              our{" "}
              <a href="https://docs.amplication.com/smart-git-sync/">
                documentation
              </a>
              .
            </div>
          }
        />
        <Question
          question="Can I pay to Amplication through my AWS account (AWS billing)?"
          answer="Yes, we support this billing method. Please contact us and we'll help you handle it."
        />
      </div>
    </div>
  );
};
