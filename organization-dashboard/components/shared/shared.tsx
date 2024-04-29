"use client";

import Image from "next/image";
import Link from "next/link";
import { RiLoader4Line } from "react-icons/ri";

import { signOut } from "@/lib/actions/login.action";
import { getSession2 } from "@/lib/actions/server-hooks/getsession.action";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SessionData } from "@/lib/iron-session/session";
import { withDrawFunds } from "@/lib/actions/payment.action";

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionData = await getSession2();
        setSession(sessionData);
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }

    fetchSession();
  }, []);

  return session;
}

// This is the Nav
export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-[#38313A] w-max min-h-screen p-4 flex flex-col fixed top-0 left-0 overflow-y-auto">
      <Image
        alt="Veridaq logo"
        src="/assets/images/veridaq-logo.png"
        width={100}
        height={100}
        className="mx-auto"
      />
      <div className="my-auto">
        <ul className="list-none flex flex-col gap-2">
          <li
            className={`gradient-border rounded-md ${pathname === "/" ? "normal-gradient-border" : ""}`}
          >
            <Link
              href="/"
              className="flex bg-[#38313A] items-center gap-4 text-white font-medium p-4"
            >
              <Image
                alt="home"
                src="/assets/icons/home.svg"
                width={20}
                height={20}
              />
              Home
            </Link>
          </li>
          <li
            className={`gradient-border rounded-md ${pathname === "/veridaq-box" ? "normal-gradient-border" : ""}`}
          >
            <Link
              href="/veridaq-box"
              className="flex bg-[#38313A] items-center gap-4 text-white font-medium p-4"
            >
              <Image
                alt="issue"
                src="/assets/icons/message.svg"
                width={20}
                height={20}
              />
              Veridaq Box
            </Link>
          </li>
          <li
            className={`gradient-border rounded-md ${pathname === "/veridaq-issue" ? "normal-gradient-border" : ""}`}
          >
            <Link
              href="/veridaq-issue"
              className="flex bg-[#38313A] items-center gap-4 text-white font-medium p-4"
            >
              <Image
                alt="inbox"
                src="/assets/icons/send.svg"
                width={20}
                height={20}
              />
              Veridaq Issue
            </Link>
          </li>
          <li
            className={`gradient-border rounded-md ${pathname === "/veridaq-store" ? "normal-gradient-border" : ""}`}
          >
            <Link
              href="/veridaq-store"
              className="flex bg-[#38313A] items-center gap-4 text-white font-medium p-4"
            >
              <Image
                alt="store"
                src="/assets/icons/security.svg"
                width={20}
                height={20}
              />
              Veridaq Store
            </Link>
          </li>
          <li
            className={`gradient-border rounded-md ${pathname === "/settings" ? "normal-gradient-border" : ""}`}
          >
            <Link
              href="/settings"
              className="flex bg-[#38313A] items-center gap-4 text-white font-medium p-4"
            >
              <Image
                alt="settings"
                src="/assets/icons/settings.svg"
                width={20}
                height={20}
              />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

const handleSignOut = async () => {
  await signOut();
};

export function Header() {
  const pathname = usePathname();
  const session = useSession();
  const name = session?.firstName;

  return (
    <header className="flex items-center gap-4">
      {pathname === "/" && (
        <p className="text-[32px] font-semibold text-gradient mr-auto">
          {`Welcome to Veridaq, ${name}`}
        </p>
      )}
      {pathname === "/veridaq-issue" && (
        <p className="text-[32px] font-semibold text-gradient mr-auto">
          Issue a Direct Veridaq, here.
        </p>
      )}
      {pathname === "/veridaq-box" && (
        <p className="text-[32px] font-semibold text-gradient mr-auto">
          Receive mails or Issue Veridaq, here.
        </p>
      )}
      {pathname === "/veridaq-store" && (
        <p className="text-[32px] font-semibold text-gradient mr-auto">
          Download and share your Veridaq, here.
        </p>
      )}
      {pathname === "/settings" && (
        <p className="text-[32px] font-semibold text-gradient mr-auto">
          Configure your Veridaq Account, here.
        </p>
      )}
      <Image
        alt="notifications"
        src="/assets/icons/bell.svg"
        width={35}
        height={35}
      />
      {session?.image ? (
        <Image
          alt="user"
          src={session.image as string}
          className="rounded-full aspect-square object-cover normal-border"
          width={50}
          height={50}
          onClick={handleSignOut}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <Image
          alt="fallback"
          src="/assets/images/user.png"
          className="rounded-full aspect-square object-cover normal-border"
          width={50}
          height={50}
          onClick={handleSignOut}
          style={{ cursor: "pointer" }}
        />
      )}
    </header>
  );
}

// Cards for the home page
export function Card({
  heading,
  paragraph,
  bgColor,
  outlineColor,
}: {
  heading: string;
  paragraph: string;
  bgColor: string;
  outlineColor: string;
}) {
  return (
    <div
      className="card rounded-lg p-6 text-[#38313A]"
      style={{
        backgroundColor: bgColor,
        borderColor: outlineColor,
        borderStyle: "solid",
        borderWidth: "3px",
      }}
    >
      <p className="font-bold text-[24px] mt-4">{heading}</p>
      <p className="text-[20px]">{paragraph}</p>
    </div>
  );
}

// Cards for the home page
export function Card2({
  heading,
  bgColor,
  outlineColor,
  textColor,
  id,
  onClick,
}: {
  heading: string;
  bgColor: string;
  outlineColor: string;
  textColor: string;
  id: string;
  onClick: (id: string) => void;
}) {
  const handleClick = () => {
    onClick(id); // Pass the id to the onClick handler
  };

  return (
    <div
      className="card rounded-lg py-[50px] px-5 text-[#38313A] flex items-center justify-center text-center hover:cursor-pointer"
      style={{
        backgroundColor: bgColor,
        borderColor: outlineColor,
        borderStyle: "solid",
        borderWidth: "3px",
        color: textColor,
      }}
      id={id}
      onClick={handleClick} // Use the new handleClick function
    >
      <p className="font-bold text-[20px] mt-4">{heading}</p>
    </div>
  );
}

export function Card3({
  heading,
  bgColor,
  outlineColor,
  textColor,
  link,
}: {
  heading: string;
  bgColor: string;
  outlineColor: string;
  textColor: string;
  link: string;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copy, setCopy] = useState("Copy Link");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCopyLink = (link: string) => {
    // Copy link to clipboard
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setCopy("Copied");
          console.log("Link copied to clipboard!");
          setTimeout(() => {
            setCopy("Copy Link");
          }, 4000);
        })
        .catch((error) => {
          // Unable to write to clipboard
          console.error("Failed to copy link to clipboard:", error);
        });
    } else {
      setCopy("Unable to Copy");
    }
  };

  return (
    <div
      className="card rounded-lg text-[#38313A] text-center relative"
      style={{
        backgroundColor: bgColor,
        borderColor: outlineColor,
        borderStyle: "solid",
        borderWidth: "3px",
        color: textColor,
      }}
    >
      <p className="font-bold text-[20px] mt-4 px-1 py-[30px] text-wrap">
        {heading}
      </p>
      <div
        className="py-2 flex justify-center text-center"
        style={{ backgroundColor: outlineColor }}
      >
        <button onClick={toggleDropdown} className="hover:cursor-pointer">
          <Image
            src={"/assets/icons/icon-command.png"}
            alt="options"
            width={40}
            height={40}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 z-10 bg-white text-black rounded-lg shadow-md">
            <button
              onClick={() => handleCopyLink(link)}
              className="block w-full py-2 px-4 text-left"
            >
              {copy}
            </button>
            <Link href={link}>
              <button className="block w-full py-2 px-4 text-left">Open</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchBar() {
  return (
    <div className="bg-[#E1D7E2]">
      <label
        htmlFor="search"
        className="flex items-center gap-4 gradient-border1 w-max p-2 ml-auto rounded-md mt-8"
      >
        <input
          type="text"
          id="search"
          placeholder="search"
          className="border-none outline-none block bg-transparent w-[250px] text-[#5E5C64] placeholder:text-[#5E5C64] capitalize"
        />
        <Image
          src="/assets/icons/search.svg"
          width={25}
          height={25}
          className="object-contain"
          alt="search"
        />
      </label>
    </div>
  );
}

export function SearchBar2() {
  return (
    <div className="">
      <label
        htmlFor="search"
        className="flex items-center gap-4 bg-[#E1D7E2] border-4 border-[#554957] w-max p-2 ml-auto rounded-md mt-8"
      >
        <input
          type="text"
          id="search"
          placeholder="search"
          className="border-none outline-none block bg-transparent w-[250px] text-[#5E5C64] placeholder:text-[#5E5C64] capitalize"
        />
        <Image
          src="/assets/icons/search.svg"
          width={25}
          height={25}
          className="object-contain"
          alt="search"
        />
      </label>
    </div>
  );
}

export function Wallet() {
  const [isError, setIsError] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const balance = session?.walletBalance as string;
  const isZeroBalance: boolean = balance === "0.00";

  async function handleWithdraw() {
    setIsLoading(true);
    setIsError(false);
    const result = await withDrawFunds();

    if (result) {
      setIsLoading(false);
      setIsSuccessful(true);
    } else {
      setIsError(true);
      console.log("I returned false");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="bg-[#554957] px-4 rounded-lg py-4 text-center">
        <p className="text-sm text-[#FAEBEB] mb-5">Your Wallet Balance:</p>
        <p className="text-[32px] text-white font-bold">{`N${balance}`}</p>
      </div>
      <div className="flex-col justify-center items-center text-center text-white">
        <button
          type="submit"
          className="text-[20px] bg-[#694C9F] rounded-full p-1 px-2 flex items-center justify-center"
          disabled={!isZeroBalance || isLoading}
          onClick={handleWithdraw}
        >
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src={"/assets/icons/minus.png"}
              alt="minus_icon"
              width={30}
              height={30}
            />
            <span style={{ marginLeft: "5px" }}>
              {isLoading ? (
                <>
                  Withdrawing...
                  <RiLoader4Line className="animate-spin text-2xl inline" />
                </>
              ) : (
                "Withdraw funds"
              )}
            </span>
          </div>
        </button>
      </div>
      {isError ? (
        <StatusMessage
          message="An Error occurred! Ensure your bank details is correct"
          type="error"
        />
      ) : null}
      {isSuccessful ? (
        <StatusMessage message="Your money is on its way!" type="success" />
      ) : null}
    </div>
  );
}

export function MessageView({
  name,
  timestamp,
  message,
  imgSrc,
}: {
  name: string;
  timestamp: string;
  message: string;
  imgSrc: string;
}) {
  return (
    <div className="flex items-start py-2 border-b border-gray-300">
      <div className="pr-4 flex-shrink-0">
        <div className="relative w-10 h-10">
          <Image
            src={imgSrc}
            alt="user"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-500 ml-auto">{timestamp}</p>
        </div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}

export function MessageCard({
  message,
  timeStamp,
  bgColor,
}: {
  message: string;
  timeStamp: string;
  bgColor: string;
}) {
  return (
    <div className="bg-[#443B46] rounded-xl p-3 w-[70%]">
      <div className="text-left text-sm font-medium pb-1 text-white">
        <p>{message}</p>
      </div>
      <div className="text-right text-xs text-gray-500">
        <p>{timeStamp}</p>
      </div>
    </div>
  );
}

export function MessageLabel({
  imgSrc,
  name,
}: {
  imgSrc: string;
  name: string;
}) {
  return (
    <div className="absolute top-0 left-0 w-full mt-4 ml-4 mr-2 rounded-lg veridaq-gradient text-white z-10 shadow-md p-2 flex flex-grow items-center">
      <div className="mr-4">
        <Image
          src={imgSrc}
          alt="user_icon"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
      <div className="font-bold text-lg">{name}</div>
    </div>
  );
}

export function MessageBox() {
  return (
    <div className="absolute bottom-0 left-0 w-full m-5">
      <label className="flex items-center gap-4 gradient-border1 bg-[#38313A] w-full rounded-full">
        <input
          type="text"
          id="chat"
          placeholder="Your Message..."
          className="border-none outline-none block bg-[#38313A] text-white placeholder:text-white capitalize"
        />
        <Image
          src="/assets/icons/icon-send.png"
          width={25}
          height={25}
          className=""
          alt="send_btn"
        />
      </label>
    </div>
  );
}

export function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={"/assets/images/checkmark.png"}
        alt="checkmark"
        width={400}
        height={400}
      />
      <p className="text-[24px] font-semibold text-lg p-3 text-center">
        Your Veridaq Request is Successful!
      </p>
    </div>
  );
}

export function ErrorMessage() {
  return (
    <div className="">
      <Image
        src={"/assets/images/checkmark.png"}
        alt="checkmark"
        width={400}
        height={400}
      />
      <p className="text-[24px] font-semibold">
        Your Veridaq Request is UnSuccessful! Please try again later
      </p>
    </div>
  );
}

export function VeridaqDocument({
  DocDetails,
  DocDate,
  id,
  docId,
  onClick,
}: {
  DocDetails: string;
  DocDate: string;
  id: string;
  docId: string;
  onClick: (id: string, docId: string) => void;
}) {
  const handleClick = () => {
    onClick(id, docId); // Pass the id to the onClick handler
  };

  return (
    <div
      className="flex items-start gap-3 pt-4 pb-4 hover:cursor-pointer"
      onClick={handleClick}
    >
      <div className="">
        <Image
          src={"/assets/icons/veridaq_icon.svg"}
          alt="veridaq_icon"
          width={40}
          height={40}
        />
      </div>
      <div className="flex-col items-start">
        <div className="">
          <p>{DocDetails}</p>
        </div>
        <div className="">
          <p>{DocDate}</p>
        </div>
      </div>
    </div>
  );
}

interface StatusMessageProps {
  message: string;
  type: "error" | "success";
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Message disappears after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 p-3 rounded-md text-white ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {message}
    </div>
  );
};

export default StatusMessage;
