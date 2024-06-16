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
          question="What plan is best for me and my team?"
          answer={
            <div>
              Choosing the right plan depends on your project needs:
              <p>
                <br />
                <strong>Free Plan:</strong>
                <br />
                Ideal for individual developers working on small-scale
                applications. This plan includes core features like Node.js
                support, database integration, roles & permissions, GraphQL &
                REST APIs, and unlimited code generation builds. It&apos;s
                perfect for getting started without any cost.
              </p>
              <p>
                <br />
                <strong>Essential Plan:</strong>
                <br />
                This plan is best for small teams building collaborative
                projects. It includes enhanced capabilities such as support for
                both Node.js and .NET, more Jovu requests, multiple services,
                custom actions support, and additional team members.
              </p>
              <p>
                <br />
                <strong>Enterprise Plan:</strong>
                <br />
                For larger organizations with more complex needs, the Enterprise
                plan is the best fit. It includes all the features of the
                Essential plan plus unlimited Jovu requests, projects, services,
                and team members. Additionally, it offers advanced security
                features like SSO and 2FA, comprehensive Git sync options for
                all enterprise providers, and tools for breaking monolithic
                applications into microservices. This plan is tailored for
                scalability and integration with lifecycle management tools. For
                a full breakdown of its capabilities and to get a personalized
                quote, contact us directly.
              </p>
            </div>
          }
        />
        <Question
          question="How does Amplication pricing work?"
          answer={
            <div>
              Our pricing plans are applied per each workspace individually. The
              Free plan is offered for <strong>FREE</strong>. The Essential plan
              is offered in a monthly or annual subscription, for a single or
              multiple projects. Enterprise plan pricing will be tailored to
              your specific requirements. Contact us to get a quote.
            </div>
          }
        />
        <Question
          question="Can I upgrade at any time?"
          answer="Yes! You can upgrade anytime and your workspace plan will be immediately updated."
        />
        <Question
          question="Can I pay monthly?"
          answer="Sure. We offer monthly and annual plans. The annual plan is offered at a discount."
        />
        <Question
          question="When will I be billed?"
          answer={
            <div>
              Our paid plans are charged upfront and billed on a recurring basis
              based on your payment schedule preference (monthly or annually).
            </div>
          }
        />
        <Question
          question="Does Amplication support advanced security features like 2FA, audit logs, and SSO for organizational security concerns?"
          answer={
            <div>
              Yes, Amplication&apos;s Enterprise plan is equipped with advanced
              security features to meet the needs of your organization. This
              includes support for Single Sign-On (SSO), audit logs, and
              Two-Factor Authentication (2FA).
            </div>
          }
        />

        <Question
          question="We have multiple teams in the organization, can we use one account to manage separate teams?"
          answer={
            <div>
              Yes, the Enterprise plan lets you have unlimited projects,
              services, and team members. You can manage all your teams from the
              same organization in your preferred structure.
            </div>
          }
        />
        <Question
          question="Can I pay to Amplication through my AWS account (AWS billing)?"
          answer={
            <div>
              Yes, we support this billing method. Please contact us and we will
              help you handle it.
            </div>
          }
        />
        <Question
          question="We have our own best practices and standards - can we ask Amplication to generate the code in our own flavor?"
          answer={
            <div>
              Amplication offers a structured way to{" "}
              <a
                className="text-secondary-purple"
                target="_blank"
                rel="noreferrer"
                href="https://docs.amplication.com/custom-code/"
              >
                add custom code
              </a>{" "}
              and modify your generated code.
              <br />
              We also provide various{" "}
              <a
                className="text-secondary-purple"
                target="_blank"
                rel="noreferrer"
                href="https://docs.amplication.com/getting-started/plugins/"
              >
                plugins
              </a>
              , like Prettier and ESLint, so you can format your code exactly
              how you need it.
              <br />
              Furthermore, you can create{" "}
              <a
                className="text-secondary-purple"
                target="_blank"
                rel="noreferrer"
                href="https://docs.amplication.com/enterprise-private-plugins/"
              >
                private plugins
              </a>{" "}
              that are accessible only within your organization.
            </div>
          }
        />
        <Question
          question="How can I customize the generated code, and will the generated code override my changes?"
          answer={
            <div>
              You can customize the generated code just like any other code
              changes in your existing code base. Amplication’s Smart Git Sync
              feature ensures that your custom code always takes precedence over
              the generated code, so your changes will not be overridden. For
              more details on how this works, please refer to our{" "}
              <a
                className="text-secondary-purple"
                target="_blank"
                rel="noreferrer"
                href="https://docs.amplication.com/smart-git-sync/"
              >
                documentation.
              </a>
            </div>
          }
        />
      </div>
    </div>
  );
};
