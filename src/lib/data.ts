import branchesRaw from '../data/branches.json';
import servicesRaw from '../data/services.json';
import articlesRaw from '../data/articles.json';

export type FAQ = { q: string; a: string };
export type Branch = (typeof branchesRaw)[number] & {
  city: string; geo: { lat: number; lon: number }; mapUrl: string; slug: string;
};
export type Service = (typeof servicesRaw)[number];
export type Article = (typeof articlesRaw)[number];

/** Approximate town-centre coordinates, used ONLY to place markers on the illustrative network diagram. */
const GEO: Record<string, [number, number, string]> = {
  ahmedabad: [23.0, 72.6, 'Ahmedabad'],
  nandesari: [22.41, 73.1, 'Nandesari'],
  vadodara: [22.3, 73.19, 'Vadodara'],
  dahej: [21.71, 72.59, 'Dahej'],
  ankleshwar: [21.63, 73.0, 'Ankleshwar'],
  panoli: [21.54, 73.03, 'Panoli'],
  sachin: [21.08, 72.88, 'Sachin (Surat)'],
  vapi: [20.37, 72.9, 'Vapi'],
  sarigam: [20.2, 72.75, 'Sarigam & Umergaon'],
  tarapur: [19.82, 72.7, 'Tarapur & Boisar'],
  vasai: [19.4, 72.86, 'Vasai'],
  bhiwandi: [19.3, 73.06, 'Bhiwandi'],
  rabale: [19.14, 73.0, 'Rabale'],
  'navi-mumbai': [19.07, 72.99, 'Navi Mumbai'],
};

export const branches: Branch[] = branchesRaw.map((b: any) => ({
  ...b,
  slug: b.id,
  city: GEO[b.id]?.[2] ?? b.name.replace(/ Branch.*$/, ''),
  geo: { lat: GEO[b.id]?.[0] ?? 0, lon: GEO[b.id]?.[1] ?? 0 },
  mapUrl: b.mapUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(b.address),
}));
export const gujaratBranches = branches.filter((b) => b.state === 'Gujarat');
export const maharashtraBranches = branches.filter((b) => b.state === 'Maharashtra');
export const branchById = (id: string) => branches.find((b) => b.id === id)!;

export const services: Service[] = servicesRaw as Service[];
export const serviceBySlug = (s: string) => services.find((x) => x.slug === s)!;

/** Short names for navigation (match live breadcrumb labels). */
export const serviceShort: Record<string, string> = {
  'full-truck-load': 'Full Truckload (FTL)',
  'part-truck-load': 'Part Load (PTL)',
  'reverse-logistics': 'Reverse Logistics',
  'chemical-industrial-freight': 'Chemical & Industrial Freight',
  'first-mile-last-mile': 'First & Last Mile',
  'project-cargo': 'Project Cargo',
  'odc-construction-cargo': 'ODC & Construction Cargo',
  'port-container-transport': 'Port Container Transport',
  warehousing: 'Warehousing & Distribution',
};

export const articles: Article[] = articlesRaw as Article[];

const pageFiles = import.meta.glob('../data/pages/*.json', { eager: true, import: 'default' });
export function page(name: string): any {
  const k = `../data/pages/${name}.json`;
  if (!pageFiles[k]) throw new Error('Missing page data ' + name);
  return pageFiles[k];
}

export function fmtDate(iso?: string | null) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(iso));
}
