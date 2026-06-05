/** JSON-LD builders for rich results (schema.org). */
import type { Course } from "./types";
import { SITE_URL, SITE_NAME } from "@/data/links";

const PROVIDER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: [
    "https://yasirbashir.com",
    "https://www.linkedin.com/in/yasirbashiraiengineer/",
    "https://github.com/yasirbashirai",
    "https://www.youtube.com/@YasirBashirai",
  ],
};

const INSTRUCTOR = {
  "@type": "Person",
  name: "Yasir Bashir",
  url: "https://yasirbashir.com",
  jobTitle: "AI Automation Engineer & Web Developer",
};

export function courseJsonLd(course: Course) {
  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.tagline,
    url: `${SITE_URL}/courses/${course.slug}`,
    courseCode: course.slug,
    educationalLevel: course.level,
    inLanguage: "en",
    provider: PROVIDER,
    instructor: INSTRUCTOR,
    teaches: course.outcomes,
    about: course.category,
    offers: { "@type": "Offer", category: "Free", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `P${course.durationWeeks}W`,
      instructor: INSTRUCTOR,
    },
    numberOfCredits: lessons,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}

export function itemListJsonLd(courses: Course[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Courses on LearnwithYasir",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/courses/${c.slug}`,
      name: c.title,
    })),
  };
}
