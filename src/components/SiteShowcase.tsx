import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ExternalLink, Sparkles } from "lucide-react";
import BrowserFrame from "./BrowserFrame";
import SocialIcon from "./SocialIcon";
import { SERVICES_SITE, CHAT_SITE, socials } from "@/data/links";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
};

/** Stylised preview of the services site (yasirbashiraisite). */
function ServicesPreview() {
  return (
    <div className="absolute inset-0 p-5 text-white" style={{ background: "radial-gradient(120% 120% at 0% 0%, #36c8a9 0%, #165a4c 55%, #0f2e27 100%)" }}>
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="opacity-90">YASIR BASHIR</span>
        <span className="hidden sm:flex gap-3 opacity-70"><span>Services</span><span>Portfolio</span><span>Pricing</span></span>
        <span className="rounded-full bg-white/20 px-2 py-0.5">Book a call</span>
      </div>
      <div className="mt-6">
        <div className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold">⚡ AI AUTOMATION ENGINEER</div>
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight mt-2 max-w-[80%]">
          I build AI systems &amp; web apps that grow your business
        </h3>
        <div className="flex gap-2 mt-3">
          <span className="rounded-lg bg-white text-[#165a4c] text-[10px] font-bold px-2.5 py-1.5">Work with me →</span>
          <span className="rounded-lg bg-white/15 text-[10px] font-semibold px-2.5 py-1.5">See portfolio</span>
        </div>
      </div>
      <div className="absolute bottom-3 left-5 right-5 flex gap-2">
        {["n8n", "GoHighLevel", "Chatbots", "SaaS"].map((t) => (
          <span key={t} className="rounded-md bg-white/12 px-2 py-1 text-[9px] font-medium">{t}</span>
        ))}
      </div>
    </div>
  );
}

/** Stylised preview of chatwithyasir. */
function ChatPreview() {
  return (
    <div className="absolute inset-0 p-4 bg-cream-muted">
      <div className="flex items-center gap-2 pb-2 border-b border-line">
        <span className="grid place-items-center w-7 h-7 rounded-full text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>Y</span>
        <div className="text-[11px]"><b className="text-ink">Yasir's Studio</b><div className="text-[9px] text-teal">● online</div></div>
        <span className="ml-auto rounded-full bg-teal/15 text-teal text-[9px] font-bold px-2 py-0.5">📞 WhatsApp</span>
      </div>
      <div className="space-y-2 mt-3">
        <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface border border-line px-3 py-2 text-[10px] text-ink">Hey 👋 I'm Yasir's site, let's skip the boring scroll. What do you need?</div>
        <div className="flex gap-1.5 flex-wrap">
          {["See portfolio", "Pricing", "Book a call"].map((c) => (
            <span key={c} className="rounded-full border border-teal/30 bg-surface px-2 py-1 text-[9px] font-semibold text-teal">{c}</span>
          ))}
        </div>
        <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-sm text-white px-3 py-2 text-[10px]" style={{ background: "linear-gradient(135deg,#288672,#36c8a9)" }}>I want an AI chatbot for my store</div>
      </div>
      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 rounded-full bg-surface border border-line px-3 py-1.5">
        <span className="text-[10px] text-soft flex-1">Type a message…</span>
        <span className="grid place-items-center w-5 h-5 rounded-full text-white text-[9px]" style={{ background: "#288672" }}>➤</span>
      </div>
    </div>
  );
}

export default function SiteShowcase() {
  return (
    <section className="px-4 pb-20">
      <motion.div {...fadeUp} className="max-w-6xl mx-auto">
        <div className="text-center mb-9">
          <span className="glass-pill text-teal"><Sparkles className="w-4 h-4" /> Beyond the courses</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4">Want it done for you? Work with Yasir.</h2>
          <p className="text-soft mt-2 max-w-2xl mx-auto">
            Learning here, but need it built now? I take on client projects, AI automation, web apps,
            chatbots and growth systems. Here's where to find me.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Services site */}
          <div className="glass-card card-hover p-5">
            <BrowserFrame url="yasirbashir.com"><ServicesPreview /></BrowserFrame>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="font-heading font-bold text-ink">My services website</h3>
                <p className="text-sm text-soft">Portfolio, pricing &amp; everything I build for clients.</p>
              </div>
              <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm shrink-0">Work with Yasir <ArrowRight className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Chat */}
          <div className="glass-card card-hover p-5">
            <BrowserFrame url="chatwith.yasirbashir.com"><ChatPreview /></BrowserFrame>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="font-heading font-bold text-ink">Chat with Yasir</h3>
                <p className="text-sm text-soft">Ask anything, see work, book a call, instantly.</p>
              </div>
              <a href={CHAT_SITE} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm shrink-0"><MessageCircle className="w-4 h-4" /> Start chat</a>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-soft">Follow along &amp; DM me anytime</p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="grid place-items-center w-11 h-11 rounded-full border border-line bg-surface/60 text-ink/70 hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
                style={{ backgroundImage: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg,#288672,#36c8a9)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <SocialIcon name={s.key} />
              </a>
            ))}
          </div>
          <a href={SERVICES_SITE} target="_blank" rel="noopener noreferrer" className="text-teal text-sm font-semibold inline-flex items-center gap-1 mt-1">
            yasirbashir.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
