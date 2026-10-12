// Runtime configuration for the Yanmora website.
// Point these at your public lead / contact endpoints. When empty, forms fall back
// to opening a prefilled email to `contactEmail`, so nothing is silently lost.
// NOTE: existing /contact and /eligibility routes in stacks/aapi.ts require Clerk auth;
// expose a public, rate-limited lead route before setting these.
window.YANMORA_CONFIG = {
  leadEndpoint: "",      // e.g. "https://api.example.com/public/lead"
  contactEndpoint: "",   // e.g. "https://api.example.com/public/contact"
  appUrl: "#eligibility", // where "Apply" / "Login" CTAs go (customer dashboard URL)
  partnerEndpoint: "",   // public partner-enquiry route; falls back to email when empty
  contactEmail: "info@yanmora.com", // default recipient for the contact and partner form fallbacks
  emails: {
    info: "info@yanmora.com",
    product: "product@yanmora.com",
    support: "support@yanmora.com",
  },
  contactPhone: "", // e.g. "+91 98765 43210"; the phone line stays hidden while empty
};
