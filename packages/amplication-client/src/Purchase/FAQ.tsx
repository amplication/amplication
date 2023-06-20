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
              Our pricing plans are applied per each workspace individually.
              <br />
              <br />
              Free edition is offered for <span className="bold">FREE</span>.
              <br />
              Pro edition is currently $320 per month (paid annually) or $400
              per month (paid monthly).
              <br /> Enterprise edition pricing will be tailored to your
              specific requirements. Contact us to get a quote.
            </div>
          }
        />
        <Question
          question="What plan is best for me and my team?"
          answer="Check out our available plans on this page to compare our various offerings and select the plan that best fits your needs."
        />
        <Question
          question="Can I upgrade at any time?"
          answer="Yes! You can upgrade anytime and your workspace plan will be immediately updated."
        />
        <Question
          question="Can I pay monthly?"
          answer="Sure. We offer monthly and annual plans. The annual plan is offered at a discount. "
        />
        <Question
          question="When will I be billed?"
          answer="Our paid plans are charged upfront and billed on a recurring basis based on your payment schedule preference (monthly or annually)."
        />
        <Question
          question="What does the renewal process look like?"
          answer="Paid subscriptions automatically renew for the same subscription period unless you downgrade your plan before your renewal date."
        />
        <Question
          question="How do I cancel my subscription?"
          answer={
            <div>
              Very soon you will be able to manage your subscriptions in the
              workspace settings. For now, you can reach out directly to us{" "}
              <MailTo
                email="mailto:sales@amplication.com"
                subject="Update workspace plan"
                body="here"
              />{" "}
              and we will update your plan as requested.
            </div>
          }
        />
        <Question
          question="What happens when I downgrade a subscription?"
          answer="You may downgrade your paid subscription any time before the renewal date. The subscription will automatically downgrade at the end of the billing cycle."
        />
        <Question
          question="Are you going to change your pricing in the future?"
          answer="The current pricing is set to show our appreciation to early adopters of our service. We may change the pricing in the future, however as a team of developers we are committed to pricing being as developer-friendly as possible. "
        />
        <Question
          question="Are there any hidden fees or charges not included in the listed price?"
          answer="The listed prices include all you need to generate your code. Amplication adds no extra charges.  However, in some countries or jurisdictions, additional VAT or other taxes may be payable (see below). "
        />
        <Question
          question="What about VAT or other taxes?"
          answer="All prices exclude tax, because there are different taxes applied in different areas. When paying by credit card, local taxes will be added upon subscription, in accordance with the details you'll provide. "
        />
        <Question
          question="What forms of payment do you accept?"
          answer="We accept payments via all major Credit Cards"
        />
        <Question
          question="Do I get a notification if I am approaching my usage limits?"
          answer={`We constantly show you your plan limitations within your workspace. We will not block you from configuring your services but in order to generate the code you will need to comply with the workspace plan limits.

          We will notify you via email or other means when we think it might be a good time for you to consider upgrading your workspace plan.`}
        />
        <Question
          question="What if I need to add more team members?"
          answer="No problem. Select the plan that meets your needs. The Free edition supports up to two user seats, the Pro edition supports up to five user seats, and the Enterprise edition has no limit. "
        />
        <Question
          question="Can I pay for my subscription with an invoice?"
          answer={
            <div>
              Companies can use invoices to purchase Enterprise subscriptions.
              Please{" "}
              <MailTo
                email="mailto:sales@amplication.com"
                subject="Amplication Enterprise Plan Inquiry"
                body="contact sales"
              />{" "}
              for more information and to purchase.
            </div>
          }
        />
        <Question
          question="We're an open-source project, is there special pricing available?"
          answer={
            <div>
              Yes, as part of our commitment to support open-source projects, we
              offer the pro plan for free. Reach out{" "}
              <MailTo
                email="mailto:sales@amplication.com"
                subject="Pro plan for Open Source project"
                body="here"
              />{" "}
              and we will set you up.
            </div>
          }
        />
      </div>
    </div>
  );
};
