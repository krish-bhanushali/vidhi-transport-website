import { branches, services, serviceShort, articles } from '../lib/data';

export type NavLink = { label: string; href: string; desc?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = { label: string; href: string; intro: string; groups: NavGroup[] };

export const mainNav: NavItem[] = [
  {
    label: 'Services', href: '/services.html',
    intro: 'Nine road-freight services for industrial dispatch across Gujarat and Maharashtra.',
    groups: [
      { title: 'Core freight', links: services.slice(0, 5).map((s) => ({ label: serviceShort[s.slug], href: s.path })) },
      { title: 'Specialised movement', links: services.slice(5).map((s) => ({ label: serviceShort[s.slug], href: s.path })) },
    ],
  },
  {
    label: 'Industries', href: '/Clientele.html',
    intro: 'Freight coordination shaped by the cargo, packaging and dispatch rhythm of each sector.',
    groups: [
      { title: 'Sectors', links: [
        { label: 'Industries we serve', href: '/Clientele.html' },
        { label: 'Chemical & industrial freight', href: '/services/chemical-industrial-freight.html' },
        { label: 'Project & machinery cargo', href: '/services/project-cargo.html' },
        { label: 'Warehousing & distribution', href: '/services/warehousing.html' },
      ] },
    ],
  },
  {
    label: 'Network', href: '/branch-locator.html',
    intro: '14 listed branch locations: nine in Gujarat, five in Maharashtra.',
    groups: [
      { title: 'Gujarat', links: branches.filter((b) => b.state === 'Gujarat').map((b) => ({ label: b.city, href: b.areaPage })) },
      { title: 'Maharashtra', links: branches.filter((b) => b.state === 'Maharashtra').map((b) => ({ label: b.city, href: b.areaPage })) },
    ],
  },
  {
    label: 'Company', href: '/about-us.html',
    intro: 'More than 25 years of industrial road logistics along the Gujarat–Maharashtra corridor.',
    groups: [
      { title: 'About', links: [
        { label: 'About Vidhi Transport', href: '/about-us.html' },
        { label: 'Infrastructure & operations', href: '/our-infrastructure.html' },
        { label: 'Credentials', href: '/certifications.html' },
        { label: 'Careers', href: '/careers.html' },
      ] },
      { title: 'Responsibility', links: [
        { label: 'CSR & Go Green', href: '/csr.html' },
        { label: 'Governance', href: '/governance.html' },
        { label: 'Group of Companies', href: '/group-companies.html' },
      ] },
    ],
  },
  {
    label: 'Insights', href: '/content.html',
    intro: 'Practical road-freight guidance for dispatch and procurement teams.',
    groups: [
      { title: 'Latest guides', links: [{ label: 'All insights', href: '/content.html' }, ...articles.map((a) => ({ label: a.h1, href: a.path }))] },
    ],
  },
  {
    label: 'Tools', href: '/tools.html',
    intro: 'Track an LR, request a pickup, raise a query or prepare dispatch documents.',
    groups: [
      { title: 'Customer tools', links: [
        { label: 'Track LR', href: '/lr-track.html' },
        { label: 'Request a pickup', href: '/pickup-request.html' },
        { label: 'Freight inquiry', href: '/inquiry.html' },
        { label: 'Get a quote', href: '/contact_us.html#quote' },
      ] },
      { title: 'Support', links: [
        { label: 'Help desk', href: '/help-desk.html' },
        { label: 'Service complaint', href: '/service-complaint.html' },
        { label: 'GST & e-way bill guidance', href: '/tax-forms.html' },
        { label: 'All customer tools', href: '/tools.html' },
      ] },
    ],
  },
];
