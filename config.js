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
  contactEmail: "support@yanmora.com",
  contactPhone: "+91 00000 00000",
};
