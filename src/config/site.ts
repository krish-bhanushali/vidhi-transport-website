/** Verified company facts, taken from the live website (www.vidhitransport.com, crawled 11 Oct 2026).
 *  Edit here; every page reads from this file. Never add unverified claims. */
export const site = {
  name: 'Vidhi Transport',
  legalName: 'Vidhi Transport Co.',
  tagline: 'Cargo movers and transport contractors',
  url: 'https://www.vidhitransport.com',
  phone: '+91 98253 21589',
  phoneHref: 'tel:+919825321589',
  whatsapp: '919825321589',
  email: 'customercare@vidhitransport.com',
  hours: 'Open daily, 8:00 AM–10:00 PM IST',
  hoursShort: '8:00 AM–10:00 PM IST, daily',
  headOffice: {
    label: 'Head office',
    street: '803, 8th Floor, Haware Infotech, Near Inorbit Mall',
    locality: 'Vashi, Navi Mumbai',
    region: 'Maharashtra',
    postalCode: '400703',
    country: 'IN',
    full: '803, 8th Floor, Haware Infotech, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vidhi-transport-company/' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591621850564' },
    { label: 'Instagram', href: 'https://www.instagram.com/vidhitransportco/' },
  ],
  /** Published on the live site (home, about, articles). Fleet count intentionally NOT used: pending owner confirmation. */
  facts: {
    yearsLabel: '25+',
    years: 25,
  },
  credentials: [
    { id: 'go-green', name: 'Go Green', label: 'Environmental initiative', icon: '/assets/images/badges/go-green.svg' },
    { id: 'iba-approved', name: 'IBA Approved', label: "Indian Banks' Association transporter approval", icon: '/assets/images/badges/iba-approved.svg' },
    { id: 'iso-certified', name: 'ISO Certified', label: 'Documented processes', icon: '/assets/images/badges/iso-certified.svg' },
  ],
  tracking: {
    apiUrl: 'https://vidhierp.in/service.aspx',
    apiVersion: '1',
    deviceId: 'KRISH_ID',
    appId: 'V01',
    control: 'getLRWebsite',
    timeout: '15000',
  },
  // Linked from the live inquiry page, but returns Google "Page not found" (checked 11 Oct 2026). Not used; see docs/integrations-and-owner-inputs.md.
  googleForm: 'https://docs.google.com/forms/d/e/1FAIpQLSdFkAUVWAK8TZXkM-nXbHUvYo0liFqx_WbNgfGcQvyl3C0Cwg/viewform',
} as const;

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const telHref = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '');
