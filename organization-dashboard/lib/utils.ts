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
  const numbers: number[] = [];
  let result: string = "";

  while (numbers.length < 4) {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100

    // Check if the random number is unique
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
      result += `Veridaq-${randomNumber} `;
    }
  }

  // Trim any trailing space
  result = result.trim();

  return result;
}

export function concatenateDates(startDate: Date, endDate?: Date): string {
  // Format start date
  const formattedStartDate = startDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (endDate) {
    // Format end date
    const formattedEndDate = endDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Concatenate formatted dates with "--" in between
    return `${formattedStartDate} -- ${formattedEndDate}`;
  } else {
    // Construct "Till Date" string using the year from the start date
    const year = startDate.getFullYear();
    return `${formattedStartDate} -- Till ${year}`;
  }
}

export function getCurrentDateTime(): string {
  const currentDate = new Date();

  // Get day, month, and year
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
  const year = currentDate.getFullYear();

  // Get hours, minutes, and AM/PM
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format day, month, year, hours, and minutes
  const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}${amOrPm}`;

  // Return formatted date and time
  return `${formattedDate} ${formattedTime}`;
}
