import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import getSession from "./actions/server-hooks/getsession.action";
import { SessionData } from "./iron-session/session";
import { Resend } from 'resend';
// import { SendVerificationRequestParams } from "next-auth/providers/email";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// export const sendVerificationRequest = async (
//   params: SendVerificationRequestParams,
// ) => {
//   let { identifier: email, url, provider: { from } } = params;
//   try {
//     const resend = new Resend( process.env.RESEND_API_KEY! );
//     await resend.emails.send({
//       from: from,
//       to: email,
//       subject: 'Login Link to your Account',
//       html: '<p>Click the magic link below to sign in to your account:</p>\
//              <p><a href="' + url + '"><b>Sign in</b></a></p>',
//     });
//   } catch (error) {
//     console.log({ error });
//   }
// };



export async function saveSession(session: SessionData): Promise<void> {
  // Check if session exists
  let existingSession = await getSession();

  // Assign session properties
  existingSession.userId = session.userId;
  existingSession.email = session.email;
  existingSession.firstName = session.firstName;
  existingSession.lastName = session.lastName;
  existingSession.image = session.image;
  existingSession.role = session.role;
  existingSession.orgId = session.orgId;
  existingSession.isOnboarded = session.isOnboarded;
  existingSession.isVerified = session.isVerified;
  existingSession.isLoggedIn = session.isLoggedIn;

  // Save the session
  await existingSession.save();
}