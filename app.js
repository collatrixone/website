(() => {
  const cfg = window.YANMORA_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  // mobile nav
  const burger = $(".burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", (e) => e.target.tagName === "A" && menu.classList.remove("open"));

  // configurable app links
  document.querySelectorAll("[data-app]").forEach((a) => (a.href = cfg.appUrl || "#eligibility"));
  document.querySelectorAll("[data-email]").forEach((a) => {
    const mail = (cfg.emails && cfg.emails[a.dataset.email]) || cfg.contactEmail;
    a.href = "mailto:" + mail; a.textContent = mail;
  });
  document.querySelectorAll("[data-phone]").forEach((a) => {
    if (!cfg.contactPhone) { (a.closest("p") || a).hidden = true; return; }
    a.href = "tel:" + cfg.contactPhone.replace(/\s/g, ""); a.textContent = cfg.contactPhone;
  });

  // scroll reveal
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---- Eligibility checker (indicative LTV by collateral class) ----
  const LTV = { mf_equity: 0.45, mf_debt: 0.75, shares: 0.5, bonds: 0.7 };
  const lenders = [
    { name: "ABC Finance", rate: 10.5, ltvAdj: 1 },
    { name: "FPI Investments", rate: 11.0, ltvAdj: 1 },
  ];
  const form = $("#elig"), out = $("#result");

  const emi = (p, r, m) => { const i = r / 1200; return (p * i * Math.pow(1 + i, m)) / (Math.pow(1 + i, m) - 1); };
  const val = $("#value"), valOut = $("#valueOut");
  const ten = $("#tenure"), tenOut = $("#tenureOut");
  const sync = () => { valOut.textContent = inr(val.value); tenOut.textContent = ten.value + " months"; };
  val.addEventListener("input", sync); ten.addEventListener("input", sync); sync();

  function fail(id, show) { $("#" + id + "Err").style.display = show ? "block" : "none"; return !show; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mobile = form.mobile.value.trim(), pan = form.pan.value.trim().toUpperCase();
    const okM = fail("mobile", !/^[6-9]\d{9}$/.test(mobile));
    const okP = fail("pan", !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan));
    if (!okM || !okP) return;
    const type = form.type.value, value = +val.value, months = +ten.value;
    const limit = value * LTV[type];
    const best = lenders.reduce((a, b) => (a.rate <= b.rate ? a : b));
    const monthly = emi(limit, best.rate, months);
    out.innerHTML = `<small>Indicative eligible limit</small><div class="big">${inr(limit)}</div>
      <small>Up to ${Math.round(LTV[type] * 100)}% of collateral value · from ${best.rate}% p.a. with ${best.name} · est. EMI ${inr(monthly)}/mo over ${months} months.
      Final limit is confirmed after depository verification of your holdings.</small>`;
    out.classList.add("show");
    if (cfg.leadEndpoint) {
      try {
        await fetch(cfg.leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: mobile, pan, collateralType: type, portfolioValue: value, source: "yanmora-web" }) });
      } catch (_) { /* result already shown; lead capture is best-effort */ }
    }
  });

  // ---- Contact form ----
  const cf = $("#contact-form"), ok = $("#contactOk");
  cf.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(cf));
    if (cfg.contactEndpoint) {
      try {
        const r = await fetch(cfg.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
        if (!r.ok) throw new Error(r.status);
        ok.textContent = "Thanks — our team will reach out within one business day.";
        ok.style.display = "block"; cf.reset(); return;
      } catch (_) { /* fall through to mailto */ }
    }
    location.href = `mailto:${cfg.contactEmail}?subject=${encodeURIComponent("Enquiry from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " · " + d.mobile)}`;
  });
})();
