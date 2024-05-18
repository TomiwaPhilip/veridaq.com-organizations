import { RiLoader4Line } from "react-icons/ri";

export function OutlineButtonSmall({ name }: { name: string }) {
  return (
    <button className="text-white text-sm px-4 py-2 rounded-md border-2 border-[#694C9F] hover:bg-transparent">
      {name}
    </button>
  );
}

export function NoOutlineButtonSmall({
  name,
  type,
}: {
  name: string;
  type: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className="veridaq-gradient text-white text-sm px-4 py-2 rounded-md border-transparent hover:bg-transparent hover:veridaq-gradient hover:border-gray-800"
    >
      {name}
    </button>
  );
}

export function OutlineButtonBig({ name }: { name: string }) {
  return (
    <button className="text-white text-sm px-4 py-4 rounded-md border-[#694C9F] border-2 hover:bg-transparent">
      {name}
    </button>
  );
}

export function NoOutlineButtonBig({
  name,
  type,
  disabled,
  loading,
}: {
  name: string;
  type: "submit" | "button";
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type={type}
      className="veridaq-gradient mt-5 text-white text-[14px] font-medium px-[5rem] py-4 rounded-md border-transparent hover:bg-transparent hover:veridaq-gradient hover:border-gray-800 md:text-[20px]"
      disabled={disabled}
    >
      {loading ? <RiLoader4Line className="animate-spin text-2xl" /> : name}
    </button>
  );
}

export function BlackButton({
  name,
  type,
  disabled,
  loading,
  onClick,
}: {
  name: string;
  type: "submit" | "button";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      className="bg-[#38313A] mt-5 text-white text-[20px] font-medium px-[3rem] py-5 rounded-md"
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? <RiLoader4Line className="animate-spin text-2xl" /> : name}
    </button>
  );
}
