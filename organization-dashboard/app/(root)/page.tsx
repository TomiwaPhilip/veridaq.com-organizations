import { redirect } from 'next/navigation'; // Import useredirect for redirection
import getSession from '@/lib/actions/server-hooks/getsession.action';

// import { getUser } from '@/lib/actions/home.action';
import HomePage from "@/components/pages/Home"

export default async function Home() {

    const session = await getSession();

    console.log("I am the the first page", session.firstName);
    console.log("I am the the first page", session.lastName);
    console.log("I am the the first page", session.userId);
    console.log("I am the the first page", session.orgId);
    console.log("I am the the first page", session.isLoggedIn);
    console.log("I am the the first page", session.image);
    console.log("I am the the first page", session.role);
    console.log("I am the the first page", session.isOnboarded);
    console.log("I am the the first page", session.isVerified);
    console.log("I am the the first page", session.email);

    // const email = session?.user?.email;

    // if (!email) {
    //   console.error('User email not found.');
    //   return;
    // }

    // // Fetch user data and handle it
    // const user = await getUser(email);
    // if (!user) {
    //   console.error('User data not found.');
    //   return;
    // }

    // const { onboarded, verified } = user;

    // if (!onboarded) {
    //   redirect('/auth/onboarding'); // Use redirect for redirection
    // } else if (!verified) {
    //   redirect('/auth/verify'); // Use redirect for redirection
    // };

  return (
    <HomePage />
  );
}
