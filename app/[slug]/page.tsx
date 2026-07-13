import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { events, getEventBySlug } from '@/lib/events';
import EventDetail from './EventDetail';

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.name,
    description: event.description,
    openGraph: {
      title:       event.name,
      description: event.description,
      images: [{
        url:    event.flyer,
        width:  800,
        height: 1200,
        alt:    event.name,
      }],
    },
    twitter: {
      card:  'summary_large_image',
      title: event.name,
      description: event.description,
      images: [event.flyer],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return <EventDetail event={event} />;
}
