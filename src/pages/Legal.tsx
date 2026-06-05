import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { CONTACT_EMAIL } from "@/data/links";

export type LegalDoc = "privacy" | "terms" | "disclaimer";

const BRAND = "LearnwithYasir";
const OWNER = "Yasir Bashir";
const EFFECTIVE = "1 June 2026";

interface Section { h: string; p: string[] }
interface Doc { title: string; intro: string; sections: Section[] }

const DOCS: Record<LegalDoc, Doc> = {
  privacy: {
    title: "Privacy Policy",
    intro: `This Privacy Policy explains how ${BRAND} ("we", "us"), operated by ${OWNER}, collects, uses and protects your information when you use this website and its courses.`,
    sections: [
      { h: "Information we collect", p: [
        "Account data: your name and email address when you sign up (via email or Google).",
        "Learning data: the courses you enrol in, lessons you complete, progress, streaks and the learning goal ('vibe') you select.",
        "Content you submit: posts you make in course community discussions.",
        "Technical data: standard log and device information your browser sends.",
      ] },
      { h: "How we use it", p: [
        "To run the platform, authenticate you, save your progress, unlock modules and issue certificates.",
        "To improve the courses and your experience.",
        "To contact you about your account, new courses, live sessions and occasional updates. You can opt out of marketing emails at any time.",
      ] },
      { h: "Where your data lives", p: [
        "Authentication and data are stored securely with Supabase. Access is protected by row-level security so you can only access your own records.",
        "We do not sell your personal data. Ever.",
      ] },
      { h: "Your rights", p: [
        `You may request access to, correction of, or deletion of your personal data by emailing ${CONTACT_EMAIL}.`,
        "You can delete community posts you've made, and request account deletion at any time.",
      ] },
      { h: "Cookies & local storage", p: [
        "We use essential local storage to keep you signed in and remember your theme and progress. We do not use intrusive third-party advertising trackers.",
      ] },
      { h: "Contact", p: [`Questions about privacy? Email ${CONTACT_EMAIL}.`] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: `By accessing or using ${BRAND}, you agree to these Terms & Conditions. If you do not agree, please do not use the platform.`,
    sections: [
      { h: "Your account", p: [
        "You're responsible for keeping your login secure and for activity under your account.",
        "You must provide accurate information and be old enough to form a binding contract in your jurisdiction.",
      ] },
      { h: "Licence to use the content", p: [
        `All course content, videos, text, lessons, guides, graphics, code samples and curriculum structure, is the exclusive property of ${OWNER} and is protected by copyright and other intellectual-property laws.`,
        "You're granted a personal, non-exclusive, non-transferable, revocable licence to access the content for your own learning.",
      ] },
      { h: "What you may NOT do", p: [
        "You may not copy, reproduce, resell, redistribute, sublicense, publicly share, or republish any course content, in whole or in part.",
        "You may not record, download, scrape or use the content to build a competing product or to train machine-learning models.",
        "You may not share your account or course access with others. Each account is for one person.",
      ] },
      { h: "Sharing (the allowed kind)", p: [
        "You're welcome, encouraged!, to share links to course pages publicly to recommend them. Sharing the actual paid/locked content is not permitted.",
      ] },
      { h: "Payments & access", p: [
        "Where courses or features are paid, access is granted on the terms shown at purchase. Free content may change or be withdrawn at any time.",
      ] },
      { h: "Termination", p: [
        "We may suspend or terminate access for breach of these Terms, including any infringement of intellectual-property rights.",
      ] },
      { h: "Changes", p: [
        "We may update these Terms; continued use after changes means you accept them.",
      ] },
      { h: "Contact", p: [`Questions? Email ${CONTACT_EMAIL}.`] },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    intro: `The information provided by ${BRAND} is for educational purposes only.`,
    sections: [
      { h: "No guarantee of results", p: [
        "Course content reflects approaches and tools that have worked for Yasir Bashir. Your results depend on your effort, market and circumstances. We make no guarantee of income, client acquisition, or specific outcomes.",
      ] },
      { h: "Not professional advice", p: [
        "Nothing here constitutes legal, financial, tax or professional advice. Consult a qualified professional for your specific situation.",
      ] },
      { h: "Third-party tools & links", p: [
        "We reference third-party tools (e.g. n8n, OpenAI, Shopify, GoHighLevel) and link to external resources. We don't control them and aren't responsible for their content, pricing, availability or changes. Tool details can change at any time, always verify on the official source.",
      ] },
      { h: "Accuracy", p: [
        "We work to keep content accurate and current, but make no warranty that it is complete, error-free or up to date at all times.",
      ] },
      { h: "Contact", p: [`Questions? Email ${CONTACT_EMAIL}.`] },
    ],
  },
};

export default function Legal({ doc }: { doc: LegalDoc }) {
  const d = DOCS[doc];
  return (
    <div className="min-h-screen">
      <Seo title={d.title} description={d.intro} path={`/${doc}`} />
      <Navbar />
      <main className="px-4 py-10 max-w-3xl mx-auto">
        <div className="glass-card p-8 md:p-10">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">{d.title}</h1>
          <p className="text-xs text-soft mt-2">Effective {EFFECTIVE} · {BRAND}</p>
          <p className="text-soft mt-5 leading-relaxed">{d.intro}</p>
          <div className="mt-8 space-y-7">
            {d.sections.map((s) => (
              <section key={s.h}>
                <h2 className="font-heading font-bold text-lg text-ink mb-2">{s.h}</h2>
                <ul className="space-y-2">
                  {s.p.map((line, i) => (
                    <li key={i} className="flex gap-2.5 text-ink/80 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal shrink-0" />{line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-line text-sm text-soft">
            <p className="font-semibold text-ink">© {new Date().getFullYear()} {OWNER}. All rights reserved.</p>
            <p className="mt-1">
              {BRAND} and all course content are the intellectual property of {OWNER}. Unauthorised copying,
              reproduction, redistribution or resale of any material is strictly prohibited and may result in
              legal action.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
