import { redirect } from "next/navigation";

import Verification from "@/components/form/verification/verification";
import getSession from "@/lib/actions/server-hooks/getsession.action";

export default async function SignOut() {
  const session = await getSession();

  // if (session.isVerified) {
  //   redirect("/");
  // }

  return <Verification />;
}
