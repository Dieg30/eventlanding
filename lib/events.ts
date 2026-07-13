export interface TicketType {
  name: string;
  price: number;
  boxOfficePrice?: number;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  date: string;
  time: string;
  location: string;
  mapUrl?: string;
  city: string;
  price: number;
  description: string;
  flyer: string;
  featured: boolean;
  past: boolean;
  ticketTypes: TicketType[];
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
    flyer: 'https://fihwweohpxcrbleidzkq.supabase.co/storage/v1/object/public/flyers/hbd-ceo-unipoli.webp',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 10 },
      { name: 'VIP', price: 20 },
    ],
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
    flyer: 'https://fihwweohpxcrbleidzkq.supabase.co/storage/v1/object/public/flyers/nacho-concert-party.webp',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 15 },
      { name: 'VIP', price: 30 },
    ],
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
    flyer: 'https://fihwweohpxcrbleidzkq.supabase.co/storage/v1/object/public/flyers/otra-noche-rbb.webp',
    featured: false,
    past: true,
    ticketTypes: [
      { name: 'General', price: 12 },
      { name: 'VIP', price: 25 },
    ],
  },
  {
    id: '4',
    slug: 'unipoli-rewind',
    name: 'Unipoli Rewind',
    date: '24 Jul 2026',
    time: '19:00',
    location: 'Explanada Municipal',
    mapUrl: 'https://maps.app.goo.gl/SuRxxQbg7295dCbq7',
    city: 'Riobamba',
    price: 3,
    description:
      'Una sola noche. Miles de recuerdos.\n\nUna experiencia diseñada para quienes vivieron cada canción, cada momento, cada historia. Los clásicos que marcaron una generación vuelven con producción de primer nivel: luces, efectos especiales y el ambiente único que solo UNIPOLI puede crear.\n\nVive. Recuerda. Repite.',
    flyer: 'https://fihwweohpxcrbleidzkq.supabase.co/storage/v1/object/public/flyers/unipoli-rewind.webp',
    featured: true,
    past: false,
    ticketTypes: [
      { name: 'Fan',  price: 3, boxOfficePrice: 5 },
      { name: 'Club', price: 5, boxOfficePrice: 7 },
    ],
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}
