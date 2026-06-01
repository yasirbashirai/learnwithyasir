import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-heading font-extrabold text-ink ${className}`}>
      <span className="grid place-items-center w-9 h-9 rounded-xl text-white text-sm font-extrabold tracking-tight shadow-soft"
        style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>
        YB
      </span>
      <span className="text-lg leading-none">
        learn<span className="gradient-text">withyasir</span>
      </span>
    </Link>
  );
}
