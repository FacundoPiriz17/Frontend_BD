import { Link } from "react-router-dom";

export default function NavButton({ href, name }) {
  return (
    <Link
      className="w-45 h-35 p-4 m-4 group flex flex-col items-center justify-center bg-blue-50 shadow-md rounded-2xl border border-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:border-blue-700"
      to={href}
    >
      <p className="text-center font-bold text-slate-900 group-hover:text-blue-700">{name}</p>
    </Link>
  );
}
