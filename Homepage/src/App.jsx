import { useState } from "react";

const plans = [
  {
    name: "Basic",
    issued: 0,
    premium: 59,
    coverage: 1200,
    recommended: "Low-risk riders and part-time coverage",
    description:
      "Starter protection for low-disruption routes and short city shifts.",
    tone: "basic"
  },
  {
    name: "Standard",
    issued: 4,
    premium: 79,
    coverage: 1500,
    recommended: "Low to medium risk delivery zones",
    description: "Balanced cover for riders in stable zones with moderate weekly exposure.",
    tone: "standard"
  },
  {
    name: "Plus",
    issued: 4,
    premium: 99,
    coverage: 1800,
    recommended: "Medium-risk riders and dense city routes",
    description: "Standard weekly protection with stronger disruption payouts.",
    tone: "plus",
    selected: true
  },
  {
    name: "Premium",
    issued: 4,
    premium: 149,
    coverage: 2500,
    recommended: "High-risk riders and volatile zones",
    description: "Enhanced payout limits for high-risk weather and disruption events.",
    tone: "premium"
  },
  {
    name: "Elite",
    issued: 0,
    premium: 199,
    coverage: 3200,
    recommended: "Critical routes, enterprise fleets, and high-value protection",
    description: "Top-tier cover with the highest payout ceiling for severe exposures.",
    tone: "elite"
  }
];

const disruptionCoverage = [
  "Heavy Rain",
  "Extreme Heat",
  "Severe Air Pollution",
  "Government Curfews",
  "Zone Closures",
  "Flooded Roads",
  "Platform Delivery Suspension"
];

const exclusions = [
  "Health issues",
  "Accidents",
  "Vehicle damage",
  "Personal leave",
  "Internet failure",
  "Rider app logout"
];

const terms = [
  "Policy protects income loss caused by external disruptions only.",
  "Claims are triggered automatically using parametric event thresholds.",
  "Weekly policy period runs Monday to Sunday and auto-renews when active.",
  "Maximum payout per disruption event is Rs. 600.",
  "Maximum payouts are limited to 2 per week and 6 per month.",
  "Location verification is required for all automated claim validations.",
  "If auto verification fails, riders can request manual review.",
  "No refund is provided for the active week after cancellation.",
  "Payout channels include UPI, bank transfer, and wallet credit."
];

function App() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="home-page">
      <section className="hero-poster">
        <div className="hero-overlay" />

        <div className="hero-content-wrap">
          <header className="main-nav">
            <div className="brand-wrap">
              <p className="eyebrow">Parametric Insurance</p>
              <h1>Income Protection Shield</h1>
            </div>

            <nav className="nav-links" aria-label="Primary">
              <a href="#coverage">Coverage</a>
              <a href="#plans">Plans</a>
              <a href="#terms">Policy Terms</a>
            </nav>

            <div className="auth-actions">
              <button className="btn btn-rider" type="button">
                Rider Login
              </button>
              <button className="btn btn-admin" type="button">
                Admin Login
              </button>
            </div>
          </header>

          <div className="hero-copy">
            <p className="hero-tag">Automatic weekly income protection</p>
            <h2>Anything can change on the road. Your weekly earnings should not.</h2>
            <p>
              External disruption detected, threshold crossed, payout initiated. This policy is
              parametric by design, so eligible events trigger compensation automatically.
            </p>

            <div className="audience-actions">
              <div>
                <p>For Riders</p>
                <button className="btn btn-pill btn-light" type="button">
                  Protect My Weekly Income
                </button>
              </div>

              <div>
                <p>For Admin Teams</p>
                <button className="btn btn-pill btn-dark" type="button">
                  Manage Claims and Risk
                </button>
              </div>
            </div>
          </div>

          <div className="floating-strip">
            <div className="strip-field">
              <label>Covered Event Types</label>
              <p>Rain, Heat, Pollution, Curfew, Flood, Zone Closure</p>
            </div>
            <div className="strip-field">
              <label>Weekly Premium</label>
              <p>Starts at Rs. 30</p>
            </div>
            <button className="btn btn-strip" type="button">
              View Plans
            </button>
          </div>
        </div>
      </section>

      <main className="content-shell">
        <section id="plans" className="plans">
          <div className="section-head">
            <h2>Available Policy Plans</h2>
            <p>A cleaner catalog view for plan tiers, coverage, and positioning.</p>
          </div>

          <div className="plan-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`plan-card ${plan.tone} ${plan.selected ? "selected" : ""}`}>
                <div className="card-head">
                  <div>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                  <span className="issued-count">{plan.issued} issued</span>
                </div>

                <div className="price-row">
                  <div className="metric">
                    <p>Weekly Premium</p>
                    <h4>Rs.{plan.premium}</h4>
                  </div>
                  <div className="metric">
                    <p>Coverage</p>
                    <h4>Rs.{plan.coverage}</h4>
                  </div>
                </div>

                <div className="card-foot">
                  <p>Recommended for: {plan.recommended}</p>
                  <button type="button" className="btn btn-plan">
                    {plan.selected ? "Selected" : "Use Plan"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="coverage" className="details-grid">
          <article className="info-card">
            <h3>Policy Coverage Scope</h3>
            <p>Loss of income caused by external disruptions that block delivery completion.</p>
            <ul>
              {disruptionCoverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="note">Income loss only. No health, accident, or vehicle damage coverage.</p>
          </article>

          <article className="info-card">
            <h3>Exclusions and Fraud Prevention</h3>
            <ul>
              {exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="note">Duplicate claims, inactive riders, and location mismatch are auto-flagged.</p>
          </article>
        </section>

        <section id="terms" className="terms-teaser">
          <h3>Need full legal details?</h3>
          <button className="btn btn-primary" type="button" onClick={() => setShowTerms(true)}>
            View Policy Terms
          </button>
        </section>
      </main>

      {showTerms ? (
        <div className="terms-overlay" role="dialog" aria-modal="true" aria-label="Policy terms">
          <div className="terms-modal">
            <div className="terms-head">
              <h3>Policy Terms (Short Version)</h3>
              <button type="button" className="btn btn-close" onClick={() => setShowTerms(false)}>
                Close
              </button>
            </div>
            <div className="terms-body">
              <ol>
                {terms.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
