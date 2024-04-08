import { redirect } from 'next/navigation'; // Import useredirect for redirection
import getSession from '@/lib/actions/server-hooks/getsession.action';

import HomePage from "@/components/pages/Home"

export default async function Home() {

    const session = await getSession();

    if (!session.isOnboarded) {
      redirect('/auth/onboarding'); // Use redirect for redirection
    } else if (!session.isVerified) {
      redirect('/auth/verification')
    }

  return (
    <HomePage />
  );
}
