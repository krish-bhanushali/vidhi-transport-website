import { site } from '../config/site';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefix a root-relative site path with the deploy base (\"\" in production). External links pass through. */
export function u(path: string): string {
  if (!path || /^(https?:|mailto:|tel:|#|data:)/.test(path)) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return BASE + path;
}
/** Absolute production URL (canonical / OG / schema). */
export function abs(path: string): string {
  if (/^https?:/.test(path)) return path;
  return site.url + (path.startsWith('/') ? path : '/' + path);
}
export const isStaging = !!import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/';
