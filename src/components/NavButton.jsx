import { Link } from "react-router-dom";

export default function NavButton({ href, name }) {
  return (
    <Link
      className="w-45 h-35 p-4 m-4 flex flex-col items-center justify-center bg-[#fcfaee] shadow-md rounded-2xl "
      to={href}
    >
      <p className="text-center font-bold text-blue-900 ">{name}</p>
    </Link>
  );
}
