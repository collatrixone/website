// Blog content + tiny hash router: blog.html (list) and blog.html#post-slug (article).
(() => {
  const POSTS = [
    { slug: "what-is-las", cat: "Basics", date: "2026-09-02", read: 4, title: "Loan against securities, explained simply",
      excerpt: "Borrow against investments you already own — without selling them. Here is how the mechanics work.",
      body: `<p>A loan against securities (LAS) lets you pledge investments such as mutual funds, shares or bonds to a regulated lender and borrow against their value. You keep ownership; the lender records a <b>lien</b> on the pledged units, which is removed when you repay.</p>
<h2>How the limit is decided</h2><p>Lenders apply a haircut to each security based on its risk. Debt instruments generally support a higher borrowing percentage than equity, which is more volatile.</p>
<h2>Two common structures</h2><ul><li><b>Overdraft:</b> a revolving limit where interest accrues only on the amount you draw.</li><li><b>Term loan:</b> a fixed amount repaid through EMIs over a set tenure.</li></ul>
<div class="callout">Your investments continue to belong to you. Returns and corporate benefits are subject to the pledge terms of your lender.</div>` },
    { slug: "las-vs-selling", cat: "Planning", date: "2026-09-16", read: 5, title: "Borrow or sell? Questions to ask before you pledge",
      excerpt: "Selling can trigger tax and break compounding. Borrowing brings its own risks. A short framework.",
      body: `<p>Needing cash doesn't always mean liquidating your portfolio. Compare the two honestly.</p>
<h2>Consider selling when</h2><ul><li>The need is long-term or permanent.</li><li>You already wanted to rebalance.</li></ul>
<h2>Consider borrowing when</h2><ul><li>The need is short-term and you have a clear repayment source.</li><li>Selling would disrupt a long-term plan or trigger avoidable tax.</li></ul>
<h2>Always check</h2><ul><li>The interest rate against your expected portfolio returns.</li><li>What happens if values fall and you must top up collateral.</li><li>Fees, charges and prepayment terms in the key fact statement.</li></ul>
<p class="disclaimer">General information, not financial or tax advice. Consult a qualified advisor for your situation.</p>` },
    { slug: "margin-calls", cat: "Risk", date: "2026-10-01", read: 4, title: "Understanding margin shortfalls — and how to avoid them",
      excerpt: "Markets move. Here's what a collateral shortfall means and how to stay ahead of it.",
      body: `<p>Because your loan is backed by securities, a fall in their market value can reduce the cover your lender requires. This is called a margin shortfall.</p>
<h2>What you can do</h2><ul><li>Pledge additional securities.</li><li>Part-repay the outstanding amount (where your product allows it).</li><li>Avoid drawing your full limit — leave a buffer.</li></ul>
<h2>Stay informed</h2><p>Enable alerts and review your collateral value periodically. If a shortfall isn't resolved within the lender's timeline, the lender may be entitled to sell pledged securities.</p>
<div class="callout">Tip: borrowing well below your eligible limit is the simplest protection against market swings.</div>` },
    { slug: "pledge-process", cat: "How-to", date: "2026-10-08", read: 3, title: "What happens when you pledge mutual funds or shares",
      excerpt: "Registrars and depositories handle the lien. A plain-language walkthrough of the OTP-based pledge.",
      body: `<p>Pledging is done through the registrar (for mutual fund units) or your depository (for demat shares), not by transferring assets to the lender.</p>
<h2>The flow</h2><ul><li>You select the holdings you want to pledge.</li><li>A one-time password is sent to your registered mobile or email for consent.</li><li>A lien is marked in favour of the lender; ownership stays with you.</li><li>On full repayment, the lien is released.</li></ul>
<p>Only securities from the lender's approved list can be pledged, and availability varies by lender.</p>` },
  ];
  const root = document.getElementById("blog-root");
  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  let cat = "All";

  function list() {
    document.title = "Blog — Yanmora Technologies";
    const cats = ["All", ...new Set(POSTS.map((p) => p.cat))];
    root.innerHTML = `<div class="chips" role="tablist">${cats.map((c) => `<button class="chip ${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("")}</div>
      <div class="cards3">${POSTS.filter((p) => cat === "All" || p.cat === cat).map((p) => `
      <article class="card post-card reveal" data-s="${p.slug}" tabindex="0" role="link" aria-label="${p.title}">
        <div class="post-meta"><span class="tag">${p.cat}</span><span>${fmt(p.date)}</span><span>${p.read} min read</span></div>
        <h3>${p.title}</h3><p>${p.excerpt}</p><span class="link">Read article →</span></article>`).join("")}</div>`;
    root.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => { cat = b.dataset.c; list(); }));
    root.querySelectorAll(".post-card").forEach((c) => {
      const go = () => (location.hash = c.dataset.s);
      c.addEventListener("click", go);
      c.addEventListener("keydown", (e) => e.key === "Enter" && go());
    });
    window.yanmoraReveal && window.yanmoraReveal();
  }

  function article(p) {
    document.title = p.title + " — Yanmora";
    root.innerHTML = `<div class="article"><a class="back" href="blog.html" id="back">← All articles</a>
      <div class="post-meta"><span class="tag">${p.cat}</span><span>${fmt(p.date)}</span><span>${p.read} min read</span></div>
      <h1>${p.title}</h1>${p.body}
      <p class="disclaimer">Informational content only; not investment, tax or legal advice. Loans are offered by regulated lending partners subject to their approval.</p>
      <a class="btn btn-primary" data-app href="index.html#eligibility">Check your eligibility</a></div>`;
    document.getElementById("back").addEventListener("click", (e) => { e.preventDefault(); history.pushState("", "", "blog.html"); route(); });
    window.scrollTo(0, 0);
  }

  function route() {
    const p = POSTS.find((x) => x.slug === location.hash.slice(1));
    p ? article(p) : list();
  }
  window.addEventListener("hashchange", route);
  route();
})();
