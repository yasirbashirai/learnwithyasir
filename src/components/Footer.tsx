import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialIcon from "./SocialIcon";
import { SERVICES_SITE, CHAT_SITE, CONTACT_EMAIL, socials } from "@/data/links";

export default function Footer() {
  return (
    <footer className="mt-20 px-4 pb-10">
      {/* Work-with-Yasir banner */}
      <div className="max-w-6xl mx-auto glass-card p-6 md:p-7 flex flex-col sm:flex-row items-center gap-4 mb-6"
        style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--teal)/0.1), transparent)" }}>
        <div className="grid place-items-center w-12 h-12 rounded-2xl text-white text-xl font-extrabold shrink-0" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>YB</div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-heading font-bold text-ink">Need it built, not just taught?</h3>
          <p className="text-sm text-soft">Hire Yasir for AI automation, web apps, chatbots &amp; growth systems.</p>
        </div>
        <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm shrink-0">Work with Yasir <ArrowRight className="w-4 h-4" /></a>
      </div>

      <div className="max-w-6xl mx-auto glass-card p-8 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1">
          <Logo />
          <p className="mt-3 text-sm text-soft max-w-md">
            Practical, project-first courses to master the exact skills Yasir uses to build
            AI automation, web apps and growth systems for clients.
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="grid place-items-center w-10 h-10 rounded-full border border-line text-ink/70 hover:text-teal hover:border-teal transition-colors">
                <SocialIcon name={s.key} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" className="text-soft hover:text-teal">Work with Yasir ↗</a>
          <Link to="/privacy" className="text-soft hover:text-teal">Privacy Policy</Link>
          <a href={CHAT_SITE} target="_blank" rel="noopener noreferrer" className="text-soft hover:text-teal">Chat with Yasir ↗</a>
          <Link to="/terms" className="text-soft hover:text-teal">Terms &amp; Conditions</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-soft hover:text-teal">Contact</a>
          <Link to="/disclaimer" className="text-soft hover:text-teal">Disclaimer</Link>
        </div>
      </div>
      <p className="text-center text-xs text-soft mt-6">
        © {new Date().getFullYear()} {""}
        <b className="text-ink/70">Yasir Bashir</b> · learnwithyasir. All rights reserved. All course content is
        protected by copyright, unauthorised copying, redistribution or resale is prohibited.
      </p>
    </footer>
  );
}
