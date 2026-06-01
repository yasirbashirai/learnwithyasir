import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-28 text-center">
        <div className="text-7xl">🧭</div>
        <h1 className="font-heading font-extrabold text-4xl text-ink mt-4">Page not found</h1>
        <p className="text-ink/65 mt-2">That page wandered off. Let's get you back on track.</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/" className="btn-primary">Home</Link>
          <Link to="/courses" className="btn-ghost border border-teal/20">Browse courses</Link>
        </div>
      </div>
    </div>
  );
}
