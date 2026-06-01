import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE } from "@/data/links";

/**
 * Lightweight, dependency-free document-head manager. Sets the title, meta
 * description, canonical, Open Graph + Twitter cards, and optional JSON-LD
 * structured data per route. Re-runs on every navigation.
 *
 * Note: social scrapers (FB/LinkedIn/Twitter) don't run JS, so they read the
 * static tags in index.html (brand-level). Google DOES render JS, so these
 * per-page tags + JSON-LD power rich results in search.
 */
export interface SeoProps {
  title: string;
  description: string;
  /** Path-relative canonical, e.g. "/courses/n8n-automation". Defaults to current path. */
  path?: string;
  image?: string;
  type?: "website" | "article";
  /** JSON-LD objects to inject (Course, BreadcrumbList, etc.). */
  jsonLd?: object[];
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({ title, description, path, image, type = "website", jsonLd, noindex }: SeoProps) {
  const loc = useLocation();
  const url = SITE_URL + (path ?? loc.pathname);
  const img = image ?? OG_IMAGE;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    upsertLink("canonical", url);

    // Open Graph
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:site", TWITTER_HANDLE);
    upsertMeta("name", "twitter:creator", TWITTER_HANDLE);

    // JSON-LD structured data
    const tag = document.getElementById("seo-jsonld");
    if (tag) tag.remove();
    if (jsonLd && jsonLd.length) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "seo-jsonld";
      s.textContent = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd);
      document.head.appendChild(s);
    }
  }, [fullTitle, description, url, img, type, noindex, jsonLd]);

  return null;
}
