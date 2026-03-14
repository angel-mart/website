import { Link } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

export default function TermsPage() {
  return (
    <div className="terms-page">
      <Header />
      <div className="terms-inner">
        <h1 className="terms-title">Terms &amp; Conditions</h1>
        <p className="terms-date">Effective Date: March 5, 2026</p>

        <section className="terms-section">
          <h2>1. Age Requirement</h2>
          <p>
            Angel Mart sells alcoholic beverages. By placing an order that includes alcohol, you
            confirm that you are at least <strong>21 years of age</strong>. A valid government-issued
            photo ID will be required at the time of delivery or pickup. Angel Mart reserves the right
            to refuse service to anyone who cannot provide valid proof of age.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Service Area</h2>
          <p>
            Angel Mart operates exclusively within <strong>Tyrant, USA</strong>. Orders outside our
            designated delivery zones will not be fulfilled. Delivery availability is subject to
            change without notice.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Orders &amp; Pricing</h2>
          <p>
            All prices listed on the site are in US dollars and include applicable taxes unless stated
            otherwise. Angel Mart reserves the right to correct pricing errors and cancel orders placed
            at an incorrect price. We will notify you of any such cancellation.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Delivery &amp; Pickup</h2>
          <p>
            Estimated delivery times are provided as a courtesy and are not guaranteed. Risk of loss
            or damage passes to the customer upon delivery. Pickup orders must be collected within
            24 hours of the order being marked ready.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Refunds &amp; Returns</h2>
          <p>
            Due to the perishable and regulated nature of our products, all sales are final unless an
            item is damaged or incorrect. Please contact us within 24 hours of receiving your order
            if there is an issue.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Responsible Service</h2>
          <p>
            Angel Mart is committed to responsible alcohol service. We comply with all Texas Alcoholic
            Beverage Commission (TABC) regulations. Intoxicated persons will not be served. Please
            drink responsibly.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Privacy</h2>
          <p>
            We collect only the information necessary to process your orders and improve your
            experience. We do not sell or share your personal information with third parties for
            marketing purposes. Order data may be retained for legal and compliance purposes.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Changes to These Terms</h2>
          <p>
            Angel Mart may update these Terms &amp; Conditions at any time. Continued use of the
            app after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Contact</h2>
          <p>
            For questions about these terms, please reach out to us through the Angel Mart app or
            visit us in store.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  )
}
