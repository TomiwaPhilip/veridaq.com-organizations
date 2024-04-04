import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  email?: string;
  orgId?: string;
  firstName?: string;
  lastName?: string
  image?: string;
  role?: string;
  isOnboarded?: boolean;
  isVerified?: boolean;
  isLoggedIn: boolean;
}

export const defaultSession:SessionData = {
  isLoggedIn:false
}

export const sessionOptions: SessionOptions ={
  password: process.env.SESSION_SECRET!,
  cookieName: "veridaq-session",
  cookieOptions:{
    httpOnly:true,
    secure: process.env.NODE_ENV === "production"
  }
}