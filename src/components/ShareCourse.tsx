import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import SocialIcon from "./SocialIcon";

/**
 * Encourages learners to share a course. Builds share intents for the major
 * networks + a copy-link button.
 */
export default function ShareCourse({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/courses/${slug}` : `/courses/${slug}`;
  const text = `I'm learning ${title} on learnwithyasir 🎓, practical, project-first. Check it out:`;

  const intents = [
    { key: "linkedin" as const, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { key: "facebook" as const, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  };

  const nativeShare = async () => {
    if (navigator.share) { try { await navigator.share({ title, text, url }); } catch { /* cancelled */ } }
    else copy();
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Share2 className="w-5 h-5 text-teal" />
        <h2 className="font-heading font-bold text-lg text-ink">Enjoying this? Share it</h2>
      </div>
      <p className="text-sm text-soft mb-4">Know someone who'd level up from this course? Send it their way 💚</p>
      <div className="flex flex-wrap gap-2">
        <a href={x} target="_blank" rel="noopener noreferrer" className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink/70 hover:text-teal hover:border-teal transition-colors" aria-label="Share on X">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/></svg>
        </a>
        {intents.map((i) => (
          <a key={i.key} href={i.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${i.label}`}
            className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink/70 hover:text-teal hover:border-teal transition-colors">
            <SocialIcon name={i.key} className="w-4 h-4" />
          </a>
        ))}
        <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink/70 hover:text-[#25D366] hover:border-[#25D366] transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.057zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
        </a>
        <button onClick={nativeShare} className="btn-outline text-sm ml-1"><Share2 className="w-4 h-4" /> Share</button>
        <button onClick={copy} className="btn-ghost text-sm border border-line">
          {copied ? <><Check className="w-4 h-4 text-teal" /> Copied</> : <><Link2 className="w-4 h-4" /> Copy link</>}
        </button>
      </div>
    </div>
  );
}
