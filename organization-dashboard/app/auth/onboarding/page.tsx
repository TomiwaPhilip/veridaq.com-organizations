import { redirect } from "next/navigation";

import Onboard from "@/components/form/onboarding/onboard";
import getSession from "@/lib/actions/server-hooks/getsession.action";

export default async function Onboarding() {
  const session = await getSession();

  if (session.isOnboarded) {
    redirect("/");
  }

  return <Onboard />;
}
