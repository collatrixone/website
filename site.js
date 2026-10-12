// Shared behaviour for inner pages (blog, partner): nav, config links, reveal.
(() => {
  const cfg = window.YANMORA_CONFIG || {};
  const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", () => burger.setAttribute("aria-expanded", menu.classList.toggle("open")));
  }
  document.querySelectorAll("[data-app]").forEach((a) => (a.href = cfg.appUrl && cfg.appUrl !== "#eligibility" ? cfg.appUrl : "index.html#eligibility"));
  document.querySelectorAll("[data-email]").forEach((a) => { a.href = "mailto:" + cfg.contactEmail; a.textContent = cfg.contactEmail; });

  window.yanmoraReveal = () => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.1 });
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  };
  window.yanmoraReveal();

  // partner enquiry form
  const pf = document.getElementById("partner-form");
  if (pf) {
    const ok = document.getElementById("partnerOk");
    pf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(pf));
      if (cfg.partnerEndpoint) {
        try {
          const r = await fetch(cfg.partnerEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, source: "yanmora-web-partner" }) });
          if (!r.ok) throw new Error(r.status);
          ok.textContent = "Thanks — our partnerships team will contact you within two business days.";
          ok.style.display = "block"; pf.reset(); return;
        } catch (_) { /* fall back to email */ }
      }
      const body = Object.entries(d).map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${cfg.contactEmail}?subject=${encodeURIComponent("Partner enquiry — " + d.firm)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
