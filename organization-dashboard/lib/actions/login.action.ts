"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getSession from "@/lib/actions/server-hooks/getsession.action";
import { getGoogleAuthUrl } from "@/lib/actions/server-hooks/google-auth.action";

let username = "john";
let isPro = true;
let isBlocked = true;



export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  // CHECK USER IN THE DB
  // const user = await db.getUser({username,password})

  if (formUsername !== username) {
    return { error: "Wrong Credentials!" };
  }

  // session.userId = "1";
  // session.username = formUsername;
  // session.isPro = isPro;
  session.isLoggedIn = true;

  await session.save();
  redirect("/");
};

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

export const changeUsername = async (formData: FormData) => {
  const session = await getSession();

  const newUsername = formData.get("username") as string;

  username = newUsername;

  // session.username = username;
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