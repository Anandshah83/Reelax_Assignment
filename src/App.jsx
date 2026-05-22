import { useMemo, useState } from 'react';

const initialForm = {
  companyName: 'abhigyan',
  email: 'abhigyan.pandey@getreelax.com',
  gstNumber: '',
  panNumber: '',
  premise: '',
  street: '',
  state: '',
  city: '',
  country: 'India',
  pinCode: '',
};

const fieldRows = [
  [
    { name: 'companyName', label: 'Company Name', placeholder: 'Company Name' },
    { name: 'email', label: 'Email', placeholder: 'Email', type: 'email' },
  ],
  [
    { name: 'gstNumber', label: 'GST Number', hint: 'Optional', placeholder: 'GST Number' },
    { name: 'panNumber', label: 'PAN Number', hint: 'Optional', placeholder: 'PAN Number' },
  ],
  [
    { name: 'premise', label: 'Premise/House no.', placeholder: 'Premise/House no.' },
    { name: 'street', label: 'Street', placeholder: 'Street' },
  ],
  [
    { name: 'state', label: 'State', placeholder: 'Select state', type: 'select', options: ['Maharashtra', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'Bihar'] },
    { name: 'city', label: 'City', placeholder: 'Select city', type: 'select', options: ['Mumbai', 'New Delhi', 'Bengaluru', 'Lucknow', 'Patna'] },
  ],
  [
    { name: 'country', label: 'Country', placeholder: 'Country' },
    { name: 'pinCode', label: 'Pin Code', placeholder: 'Pincode', inputMode: 'numeric' },
  ],
];

const coupons = {
  WELCOME20: { detail: '20% off on your first month', discount: 20 },
  ANNUAL50: { detail: '50% off on annual plans', discount: 50 },
};

function money(value) {
  return `${'\u20b9'}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function Header({ onAction }) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(event) {
    event.preventDefault();
    onAction(search ? `Searching for "${search}"` : 'Search field is ready');
  }

  return (
    <header className="topbar">
      <form className="searchBox" onSubmit={handleSearch}>
        <input
          aria-label="Search influencers"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Find influencers to collaborate with"
        />
        <button className="searchButton" type="submit" aria-label="Search">
          <SearchIcon />
        </button>
      </form>
      <div className="actions">
        <button className="upgrade" type="button" onClick={() => onAction('Upgrade clicked')}>
          <span aria-hidden="true">*</span>
          Upgrade
        </button>
        <button className="campaign" type="button" onClick={() => onAction('Create Campaign clicked')}>
          <span aria-hidden="true">+</span>
          Create Campaign
        </button>
        <div className="profileWrap">
          <button
            className="avatarButton"
            type="button"
            aria-label="Open profile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="avatar" aria-hidden="true"></span>
            <span className="hamburger" aria-hidden="true"></span>
          </button>
          {menuOpen && (
            <div className="profileMenu">
              <button type="button" onClick={() => onAction('Profile clicked')}>Profile</button>
              <button type="button" onClick={() => onAction('Settings clicked')}>Settings</button>
              <button type="button" onClick={() => onAction('Logout clicked')}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function BackToPlans({ onAction }) {
  return (
    <button className="backLink" type="button" onClick={() => onAction('Back to plans clicked')}>
      <span aria-hidden="true">&larr;</span>
      Back to plans
    </button>
  );
}

function InputField({ field, value, onChange }) {
  const labelText = field.hint ? `${field.label} ` : field.label;

  return (
    <label className="field">
      <span>
        {labelText}
        {field.hint && <em>({field.hint})</em>}
      </span>
      <div className="control">
        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            aria-label={field.label}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type || 'text'}
            inputMode={field.inputMode}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
            aria-label={field.label}
          />
        )}
        {field.type === 'select' && <b aria-hidden="true">⌄</b>}
      </div>
    </label>
  );
}

function DetailsCard({ form, onFieldChange, onCancel, onSave }) {
  return (
    <section className="detailsCard" aria-labelledby="details-title">
      <h1 id="details-title">Review your details</h1>
      <h2>Billing Information</h2>
      <div className="formGrid">
        {fieldRows.flat().map((field) => (
          <InputField key={field.name} field={field} value={form[field.name]} onChange={onFieldChange} />
        ))}
      </div>
      <div className="formFooter">
        <button className="secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary" type="button" onClick={onSave}>
          Save Details
        </button>
      </div>
    </section>
  );
}

function OrderSummary({ plan, onUpgrade }) {
  return (
    <section className="summaryCard" aria-labelledby="summary-title">
      <h2 id="summary-title">Order Summary</h2>
      <div className="planBox">
        <div>
          <strong className="price">{'\u20b9'}{plan.price.toLocaleString('en-IN')}</strong>
          <span>/month</span>
          <p>Includes {plan.credits.toLocaleString('en-IN')} credits/mo.</p>
        </div>
        <div className="selected">
          <span>Selected Plan</span>
          <strong>{plan.name}</strong>
        </div>
      </div>
      <button className="outlineButton" type="button" onClick={onUpgrade}>
        <span aria-hidden="true">+</span>
        Upgrade to Growth Plan
      </button>
    </section>
  );
}

function CouponOption({ code, detail, selected, onSelect }) {
  return (
    <button
      className={`couponOption ${selected ? 'selectedCoupon' : ''}`}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(code)}
    >
      <span>
        <strong>{code}</strong>
        <small>{detail}</small>
      </span>
      <i aria-hidden="true"></i>
    </button>
  );
}

function PaymentCard({ onAction }) {
  const [couponCode, setCouponCode] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState('WELCOME20');
  const [walletApplied, setWalletApplied] = useState(false);

  const subtotal = 14999;
  const discount = selectedCoupon ? (subtotal * coupons[selectedCoupon].discount) / 100 : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.18;
  const walletDiscount = walletApplied ? 500 : 0;
  const total = Math.max(taxableAmount + tax - walletDiscount, 0);

  function applyTypedCoupon() {
    const cleanCode = couponCode.trim().toUpperCase();
    if (coupons[cleanCode]) {
      setSelectedCoupon(cleanCode);
      onAction(`${cleanCode} applied`);
      return;
    }
    onAction('Please enter WELCOME20 or ANNUAL50');
  }

  return (
    <section className="paymentCard" aria-label="Payment details">
      <div className={`walletRow ${walletApplied ? 'activeWallet' : ''}`}>
        <span className="walletIcon" aria-hidden="true">□</span>
        <div>
          <strong>Wallet Balance</strong>
          <small>{'\u20b9'}500.00 available</small>
        </div>
        <button
          type="button"
          onClick={() => {
            setWalletApplied((applied) => !applied);
            onAction(walletApplied ? 'Wallet removed' : 'Wallet applied');
          }}
        >
          {walletApplied ? 'Remove' : 'Apply'}
        </button>
      </div>

      <div className="couponPanel">
        <div className="couponHeader">
          <span aria-hidden="true">◇</span>
          <strong>Apply Coupon</strong>
          <span aria-hidden="true">⌃</span>
        </div>
        <div className="couponInput">
          <input
            aria-label="Coupon code"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Enter coupon code"
          />
          <button type="button" onClick={applyTypedCoupon}>Apply</button>
        </div>
        {Object.entries(coupons).map(([code, coupon]) => (
          <CouponOption
            key={code}
            code={code}
            detail={coupon.detail}
            selected={selectedCoupon === code}
            onSelect={(nextCode) => {
              setSelectedCoupon(nextCode);
              setCouponCode(nextCode);
              onAction(`${nextCode} selected`);
            }}
          />
        ))}
      </div>

      <div className="totals">
        <div>
          <span>Subtotal</span>
          <strong>{money(subtotal)}</strong>
        </div>
        <div>
          <span>Tax (18% GST)</span>
          <strong>{money(tax)}</strong>
        </div>
      </div>

      <div className="dueToday">
        <strong>Total due today</strong>
        <b>{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
      </div>

      <button className="payButton" type="button" onClick={() => onAction(`Proceeding to payment: ${money(total)}`)}>
        Proceed to Payment
      </button>
    </section>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState({ name: 'Startup', price: 4999, credits: 5000 });
  const [message, setMessage] = useState('');

  const requiredMissing = useMemo(() => {
    return ['companyName', 'email', 'premise', 'street', 'state', 'city', 'country', 'pinCode'].filter((key) => !form[key].trim());
  }, [form]);

  function showMessage(text) {
    setMessage(text);
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => setMessage(''), 2200);
  }

  function handleFieldChange(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSave() {
    if (requiredMissing.length) {
      showMessage('Please fill all required billing fields');
      return;
    }
    showMessage('Details saved successfully');
  }

  function handleCancel() {
    setForm(initialForm);
    showMessage('Form reset');
  }

  function handleUpgradePlan() {
    setPlan({ name: 'Growth', price: 9999, credits: 15000 });
    showMessage('Growth plan selected');
  }

  return (
    <div className="appShell">
      <Header onAction={showMessage} />
      <main className="page">
        <BackToPlans onAction={showMessage} />
        <div className="checkoutGrid">
          <DetailsCard form={form} onFieldChange={handleFieldChange} onCancel={handleCancel} onSave={handleSave} />
          <aside className="sideColumn" aria-label="Checkout summary">
            <OrderSummary plan={plan} onUpgrade={handleUpgradePlan} />
            <PaymentCard onAction={showMessage} />
          </aside>
        </div>
      </main>
      {message && <div className="toast" role="status">{message}</div>}
    </div>
  );
}
