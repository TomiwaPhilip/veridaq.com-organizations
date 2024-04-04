"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getSession from "@/lib/actions/server-hooks/getsession.action";
import { getGoogleAuthUrl } from "@/lib/actions/server-hooks/google-auth.action";
import VerificationToken from "../utils/emailTokenSchema";
import { generateToken, sendVerificationRequest, verifyToken } from "../utils";
import connectToDB from "../model/database";


export async function signIn(email: string) {
  console.log("I want to send emails")
  try {
    connectToDB()

    // Generate token and URL for verification
    const { token, generatedAt, expiresIn } = generateToken();
    console.log(token);

    const url = `https://legendary-zebra-45v97xp5wr5fjprq-3000.app.github.dev/auth/verify?token=${token}`;
    
    // Send email with resend.dev
    await sendVerificationRequest({ url: url, email: email })
  
    // Save email address, verification token, and expiration time in the database
    await VerificationToken.create({
      token: token,
      email: email,
      createdAt: generatedAt, // Since generated in the function, set current time
      expiresAt: expiresIn,
    })
    
    // Return a response
    return true;
  } catch (error) {
    return false;
  }
}


export async function verifyUserToken(token: string): Promise<boolean> {
  try {
    connectToDB();

    const existingToken = await VerificationToken.findOne({ token: token });

    if (!existingToken) {
      console.log("Token not found in DB");
      return false; // Token not found in the database
    }

    // Check if the token has expired
    const currentTime = new Date();
    const createdAt = existingToken.createdAt;
    const expiresIn = existingToken.expiresAt;
    const timeDifference = currentTime.getTime() - createdAt.getTime(); // Time difference in milliseconds
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
    if (minutesDifference > 5) {
      console.log("Token has expired");
      // If the token has expired, delete the token document from the database
      await VerificationToken.findOneAndDelete({ token: token });
      return false; // Token has expired
    }

    // If the token is valid, delete the token document from the database
    await VerificationToken.findOneAndDelete({ token: token });
    return true; // Token is valid
  } catch (error: any) {
    console.error('Error verifying token:', error.message);
    return false;
  }
}


export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const changePremium = async () => {
  const session = await getSession();

  // isPro = !session.isPro;
  // session.isPro = isPro;
  // await session.save();
  // revalidatePath("/profile");
};



let googleAuthUrl: string
export async function handleGoogleLogin() {
  try {
    // Get the Google OAuth URL
    googleAuthUrl = await getGoogleAuthUrl();
  } catch (error) {
    console.error('Error:', error);
    // Handle error
  } finally {
    // Redirect the user to the Google OAuth URL
    redirect (googleAuthUrl)
  }
}