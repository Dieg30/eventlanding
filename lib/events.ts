export interface TicketType {
  name: string;
  price: number;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: number;
  description: string;
  flyer: string;
  featured: boolean;
  past: boolean;
  ticketTypes: TicketType[];
  bankInfo: string;
}

export const events: Event[] = [
  {
    id: '1',
    slug: 'hbd-ceo-unipoli',
    name: 'HBD CEO Unipoli',
    date: '3 Jul 2026',
    time: '19:00',
    location: 'UNIPOLI',
    city: 'Quito',
    price: 10,
    description:
      'La fiesta más grande del año en UNIPOLI. DJ Sets toda la noche con Sahid Garofalo, Joel Manzano, DEEW, Sailed, Asce, Hamilton, Galeo, Crono, Edison Castelo y más. Show Banda de Pueblo y animadores Dragón & Alex.',
    flyer: '/flyers/hbd-ceo-unipoli.png',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 10 },
      { name: 'VIP', price: 20 },
    ],
    bankInfo: 'Banco Pichincha · Cta. Ahorro 2211137604 · Diego Alexander Castro Benavides',
  },
  {
    id: '2',
    slug: 'nacho-concert-party',
    name: 'Nacho Concert Party',
    date: '5 Jun 2026',
    time: '19:00',
    location: 'AURA',
    city: 'Quito',
    price: 15,
    description:
      'Una noche de pura lokura. Trap Music Fest con DJ Lalo, Lalocura, Ety, DJ Sahid Garofalo y Sailed. Evento +18. Apertura de puertas a las 19:00.',
    flyer: '/flyers/nacho-concert-party.png',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 15 },
      { name: 'VIP', price: 30 },
    ],
    bankInfo: 'Banco Pichincha · Cta. Ahorro 2211137604 · Diego Alexander Castro Benavides',
  },
  {
    id: '3',
    slug: 'otra-noche-rbb',
    name: 'Otra Noche en RBB',
    date: '2 Jul 2026',
    time: '20:00',
    location: 'Quinta Paila de los Santos',
    city: 'Quito',
    price: 12,
    description:
      'Social Klix presenta Otra Noche en RBB. Con Toki y Bonny V en vivo + DJ Sahid Garofalo, DJ Andersson, Jota, Retro y DJ Jhoe Crossover. Animador: Dragón. Evento +18.',
    flyer: '/flyers/otra-noche-rbb.jpeg',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 12 },
      { name: 'VIP', price: 25 },
    ],
    bankInfo: 'Banco Pichincha · Cta. Ahorro 2211137604 · Diego Alexander Castro Benavides',
  },
  {
    id: '4',
    slug: 'unipoli-rewind',
    name: 'Unipoli Rewind',
    date: '24 Jul 2026',
    time: '19:00',
    location: 'UNIPOLI',
    city: 'Riobamba',
    price: 10,
    description:
      'Volvemos al origen. Play · Rewind · Repeat. Una noche para recordar en UNIPOLI 2025. Entradas disponibles próximamente. Evento +18. Música en vivo.',
    flyer: '/flyers/unipoli-rewind.png',
    featured: true,
    past: false,
    ticketTypes: [
      { name: 'General', price: 10 },
      { name: 'VIP', price: 20 },
    ],
    bankInfo: 'Banco Pichincha · Cta. Ahorro 2211137604 · Diego Alexander Castro Benavides',
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}
