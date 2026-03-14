import { useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ADMIN_APP_URL, API_BASE_URL, RIDER_APP_URL } from "./config";

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

function LandingPage() {
  const navigate = useNavigate();
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
              <button className="btn btn-rider" type="button" onClick={() => navigate("/rider/auth?mode=signin")}>
                Rider Login
              </button>
              <button className="btn btn-admin" type="button" onClick={() => window.location.href = ADMIN_APP_URL}>
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
                <button className="btn btn-pill btn-light" type="button" onClick={() => navigate("/rider/auth?mode=signup")}>
                  Protect My Weekly Income
                </button>
              </div>

              <div>
                <p>For Admin Teams</p>
                <button className="btn btn-pill btn-dark" type="button" onClick={() => window.location.href = ADMIN_APP_URL}>
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
            <button className="btn btn-strip" type="button" onClick={() => navigate("/#plans")}>
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

function RiderAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState(initialMode);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    selectedPlan: "Plus",
    platform: "Swiggy",
    city: "Chennai"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const selectedPlan = plans.find((plan) => plan.name === formState.selectedPlan) ?? plans[2];
  const formTitle = useMemo(
    () => (isSignup ? "Create your rider account" : "Welcome back, rider"),
    [isSignup]
  );

  const setModeAndUrl = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSearchParams({ mode: nextMode });
  };

  const updateField = (field) => (event) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = isSignup ? "/api/auth/rider/signup" : "/api/auth/rider/login";
      const payload = isSignup
        ? formState
        : { email: formState.email, password: formState.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Unable to complete rider authentication.");
      }

      window.location.href = RIDER_APP_URL;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-backdrop auth-backdrop-left" />
      <div className="auth-backdrop auth-backdrop-right" />
      <div className="auth-layout">
        <div className="auth-intro-card">
          <Link className="auth-home-link" to="/">GigSync</Link>
          <p className="auth-kicker">Rider Access</p>
          <h2>{formTitle}</h2>
          <p>
            Use the same GigSync platform entry point, then move straight into the rider workspace once your account is authenticated.
          </p>
          <div className="auth-feature-list">
            <div>
              <span>Protected by backend session</span>
              <strong>MongoDB-backed rider accounts</strong>
            </div>
            <div>
              <span>After login</span>
              <strong>Redirects into RiderApp automatically</strong>
            </div>
            <div>
              <span>Need admin access?</span>
              <button type="button" className="auth-inline-button" onClick={() => window.location.href = ADMIN_APP_URL}>
                Open admin login
              </button>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <div>
              <p className="auth-kicker">GigSync Rider Portal</p>
              <h1>{isSignup ? "Sign up" : "Sign in"}</h1>
            </div>
            <button type="button" className="auth-secondary-link" onClick={() => navigate("/")}>Back to home</button>
          </div>

          <div className="auth-tab-row" role="tablist" aria-label="Rider auth mode">
            <button type="button" className={`auth-tab ${!isSignup ? "active" : ""}`} onClick={() => setModeAndUrl("signin")}>Sign in</button>
            <button type="button" className={`auth-tab ${isSignup ? "active" : ""}`} onClick={() => setModeAndUrl("signup")}>Sign up</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup ? (
              <label>
                <span>Full name</span>
                <input value={formState.name} onChange={updateField("name")} placeholder="Ravi Kumar" required />
              </label>
            ) : null}

            <label>
              <span>Email address</span>
              <input type="email" value={formState.email} onChange={updateField("email")} placeholder="rider@gigsync.ai" required />
            </label>

            <label>
              <span>Password</span>
              <input type="password" value={formState.password} onChange={updateField("password")} placeholder="Enter your password" required />
            </label>

            {isSignup ? (
              <>
                <label>
                  <span>Select plan</span>
                  <select value={formState.selectedPlan} onChange={updateField("selectedPlan")}>
                    {plans.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} · Rs.{plan.premium} / week
                      </option>
                    ))}
                  </select>
                </label>

                <div className={`signup-plan-preview ${selectedPlan.tone}`}>
                  <div>
                    <p className="signup-plan-eyebrow">Chosen plan</p>
                    <h3>{selectedPlan.name}</h3>
                    <p className="signup-plan-copy">{selectedPlan.description}</p>
                  </div>
                  <div className="signup-plan-metrics">
                    <div>
                      <span>Weekly premium</span>
                      <strong>Rs.{selectedPlan.premium}</strong>
                    </div>
                    <div>
                      <span>Coverage</span>
                      <strong>Rs.{selectedPlan.coverage}</strong>
                    </div>
                  </div>
                  <p className="signup-plan-note">Recommended for: {selectedPlan.recommended}</p>
                </div>

                <div className="auth-form-grid">
                  <label>
                    <span>Platform</span>
                    <select value={formState.platform} onChange={updateField("platform")}>
                      <option>Swiggy</option>
                      <option>Zomato</option>
                      <option>Zepto</option>
                      <option>Blinkit</option>
                      <option>Dunzo</option>
                    </select>
                  </label>

                  <label>
                    <span>City</span>
                    <input value={formState.city} onChange={updateField("city")} placeholder="Chennai" required />
                  </label>
                </div>
              </>
            ) : null}

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isSignup ? "Create rider account" : "Continue to RiderApp"}
            </button>
          </form>

          <p className="auth-footnote">
            {location.pathname === "/rider/auth" && isSignup
              ? `Your ${selectedPlan.name} rider account will be created in MongoDB Atlas and logged in immediately.`
              : "Use your saved rider account to continue into the rider dashboard."}
          </p>
        </div>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/rider/auth" element={<RiderAuthPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
