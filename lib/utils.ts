import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import getSession from "./actions/server-hooks/getsession.action";
import { SessionData } from "./iron-session/session";
import crypto from "crypto";
import { Resend } from "resend";
// import { SendVerificationRequestParams } from "next-auth/providers/email";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

interface SendVerificationRequestParams {
  url: string;
  email: string;
}
export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: "onboarding@veridaq.com",
      to: params.email,
      subject: "Login Link to your Account",
      html:
        '<p>Click the magic link below to sign in to your account:</p>\
             <p><a href="' +
        params.url +
        '"><b>Sign in</b></a></p>',
    });
  } catch (error) {
    console.log({ error });
  }
};

interface sendInviteParams {
  firstName: string;
  email: string;
  organizationName: string;
}

export const sendTeamInvite = async (params: sendInviteParams) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const data = await resend.emails.send({
      from: "onboarding@veridaq.com",
      to: params.email,
      subject: "Team Invite to Veridaq",
      html: `<p>Hi, ${params.firstName}, you have been invited by ${params.organizationName} to join your organization on Veridaq.com</p>
        <p>Click <a href="https://organization.veridaq.com/auth/signin"><b>here</b></a> to join now</p>
        `,
    });
    return data;
  } catch (error) {
    console.log({ error });
  }
};

export async function saveSession(session: SessionData): Promise<void> {
  // Check if session exists
  let existingSession = await getSession();

  // Assign session properties
  existingSession.userId = session.userId;
  existingSession.email = session.email;
  existingSession.firstName = session.firstName;
  existingSession.lastName = session.lastName;
  existingSession.image = session.image;
  existingSession.walletBalance = session.walletBalance;
  existingSession.active = session.active;
  existingSession.role = session.role;
  existingSession.designation = session.designation;
  existingSession.orgId = session.orgId;
  existingSession.orgName = session.orgName;
  existingSession.isOnboarded = session.isOnboarded;
  existingSession.isVerified = session.isVerified;
  existingSession.isLoggedIn = session.isLoggedIn;

  // Save the session
  await existingSession.save();
}

// Function to hash a token
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateToken(): {
  token: string;
  generatedAt: Date;
  expiresIn: Date;
} {
  // Generate a random token
  const token = crypto.randomBytes(20).toString("hex");

  // Current time
  const generatedAt = new Date();

  // 5 minutes expiration
  const expiresIn = new Date(generatedAt.getTime() + 5 * 60 * 1000);

  // Encrypt the token using SHA-256 hash function
  const hashedToken = hashToken(token);

  return { token: hashedToken, generatedAt, expiresIn };
}

// Function to verify a token
export function verifyToken(
  providedToken: string,
  storedToken: string,
): boolean {
  // Hash the provided token
  const hashedProvidedToken = hashToken(providedToken);

  // Compare the hashed provided token with the stored token
  return hashedProvidedToken === storedToken;
}

export function generateVeridaqID(): string {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999
  return `veridaq-${randomNumber}`;
}

export function concatenateDates(startDate: Date, endDate?: Date): string {
  // Add one more day to start date
  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setDate(startDate.getDate() + 1);

  if (endDate) {
    // Add one more day to end date
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(endDate.getDate() + 1);

    // Format adjusted start date
    const formattedStartDate = adjustedStartDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

    // Format adjusted end date
    const formattedEndDate = adjustedEndDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

    // Concatenate formatted dates with "--" in between
    return `${formattedStartDate} -- ${formattedEndDate}`;
  } else {
    // Format adjusted start date
    const formattedStartDate = adjustedStartDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

    // Construct "Till Date" string
    return `${formattedStartDate} -- Till Date`;
  }
}

export function getCurrentDateTime(): string {
  const currentDate = new Date();

  // Convert UTC time to local time zone
  const localDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
  );

  // Get day, month, and year
  const day = localDate.getDate();
  const month = localDate.getMonth() + 1; // Month is zero-based, so add 1
  const year = localDate.getFullYear();

  // Get hours, minutes, and AM/PM
  let hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format day, month, year, hours, and minutes
  const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}${amOrPm}`;

  // Return formatted date and time
  return `${formattedDate} ${formattedTime}`;
}
