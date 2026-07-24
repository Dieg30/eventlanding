import { notFound, redirect } from 'next/navigation';
import { getEventBySlug } from '@/lib/events';
import { BANK_INFO } from '@/lib/bank-info';
import BuyForm from './BuyForm';

export default async function ComprarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event || event.past) notFound();

  if (event.onlineEnds && new Date() >= new Date(event.onlineEnds)) {
    redirect(`/${slug}`);
  }

  return <BuyForm event={event} bankInfo={BANK_INFO} />;
}
