/**
 * The course catalogue, one course per skill on yasirbashir.com.
 * Each entry is a compact CourseSpec; buildCourse() expands it into the full
 * 4-part curriculum. Content is real and practical; time-sensitive details
 * (pricing, exact UI steps) should be verified with deep research over time.
 */
import { buildCourse, type CourseSpec } from "./build";
import type { Course } from "@/lib/types";

const specs: CourseSpec[] = [
  {
    slug: "n8n-automation",
    icon: "🤖",
    title: "n8n Automation",
    category: "Automation",
    tagline: "Build self-hosted, no-limits workflow automations that run your business 24/7.",
    level: "Intermediate",
    flagship: true,
    outcomes: [
      "Design multi-step workflows with branching, error handling and scheduling",
      "Connect APIs, webhooks, databases and AI nodes",
      "Self-host n8n securely and sell automation as a service",
    ],
    tools: [
      {
        name: "n8n",
        what: "Open-source workflow automation, the core tool of this course.",
        steps: [
          "Create a free n8n Cloud account (or skip to self-host below).",
          "Open the canvas and add a Manual Trigger node.",
          "Add an HTTP Request node and call a public API (e.g. a weather API).",
          "Add a Set node to reshape the data, then a NoOp to inspect output.",
          "Run the workflow and read the execution log to see data flow node-to-node.",
        ],
        links: [
          { label: "n8n Docs", href: "https://docs.n8n.io" },
          { label: "n8n Cloud", href: "https://n8n.io" },
          { label: "Workflow templates", href: "https://n8n.io/workflows" },
        ],
      },
      {
        name: "Self-hosting (Docker)",
        what: "Run n8n on your own server for unlimited executions and data control.",
        steps: [
          "Spin up a small VPS (Hostinger/Hetzner/DigitalOcean).",
          "Install Docker and Docker Compose.",
          "Use the official n8n docker-compose with a Postgres service.",
          "Put it behind a reverse proxy (Caddy/Nginx) with HTTPS.",
          "Set N8N_ENCRYPTION_KEY and basic auth before exposing it.",
        ],
        links: [
          { label: "Docker install guide", href: "https://docs.n8n.io/hosting/" },
        ],
      },
    ],
    concepts: [
      { title: "Triggers, nodes & connections", text: "A workflow is a graph: a trigger starts it, nodes transform data, connections pass items along. Everything in n8n is a list of JSON items, once you internalise that, every node makes sense." },
      { title: "Webhooks vs polling vs schedule", text: "Three ways to start a workflow: webhooks (instant, push), polling (check on an interval), and schedule (cron). Choosing the right trigger is half of good automation design." },
      { title: "Error handling & idempotency", text: "Production automations fail. You'll add Error Trigger workflows, retries and idempotency keys so a re-run never double-charges or double-sends." },
    ],
    projects: [
      { title: "Lead-to-CRM-to-Slack pipeline", brief: "When a form is submitted, enrich the lead, add it to a CRM/Airtable, and notify a Slack channel.", steps: [
        "Add a Webhook trigger and submit a test payload.",
        "Add an HTTP/AI node to enrich (e.g. guess company from email domain).",
        "Append the row to Airtable or your CRM.",
        "Post a formatted message to Slack with the lead details.",
        "Add an Error Trigger workflow that DMs you if anything fails.",
      ] },
      { title: "AI content repurposer", brief: "Take one long video transcript and auto-generate a blog post, 5 tweets and a LinkedIn post.", steps: [
        "Trigger on a new row in a 'transcripts' table.",
        "Call the OpenAI node with a prompt per output format.",
        "Write each output back to its own field/table.",
        "Schedule a daily digest email of what was produced.",
      ] },
    ],
    clientNiche: "agencies, coaches and SaaS founders drowning in manual ops",
    priceAnchor: "$300–$3,000 per automation build, plus retainers",
    advanced: [
      "Sub-workflows and the Execute Workflow node for reusable modules",
      "Queue mode + worker scaling for high-volume self-hosted setups",
      "Building your own credential-secured API in front of n8n",
      "Versioning workflows in Git and promoting dev → prod",
    ],
    stayCurrent: [
      { label: "n8n Blog", href: "https://blog.n8n.io" },
      { label: "n8n Community Forum", href: "https://community.n8n.io" },
    ],
  },

  {
    slug: "ai-chatbots",
    icon: "💬",
    title: "AI Chatbots",
    category: "AI",
    tagline: "Build chatbots for web, WhatsApp & Messenger that qualify leads and book calls 24/7.",
    level: "Intermediate",
    flagship: true,
    outcomes: [
      "Design conversation flows that qualify and convert",
      "Ground a bot in your client's content (RAG) so it never makes things up",
      "Deploy to web, WhatsApp and Messenger and capture every lead",
    ],
    tools: [
      {
        name: "OpenAI API",
        what: "The LLM brain, generates on-brand answers and structured data.",
        steps: [
          "Create an API key at platform.openai.com.",
          "Test a chat completion in the playground.",
          "Learn system vs user vs assistant roles.",
          "Add a JSON-mode response to extract name/email/intent as structured data.",
          "Set spend limits so a runaway loop can't surprise you.",
        ],
        links: [
          { label: "OpenAI API docs", href: "https://platform.openai.com/docs" },
          { label: "Prompt examples", href: "https://platform.openai.com/docs/examples" },
        ],
      },
      {
        name: "ManyChat / Voiceflow",
        what: "Visual builders for WhatsApp/Messenger flows and web chat.",
        steps: [
          "Pick ManyChat for social channels, Voiceflow for designable web bots.",
          "Map the happy-path flow: greet → qualify → answer → CTA (book/handoff).",
          "Connect the OpenAI step for free-text answers.",
          "Add a fallback to a human when confidence is low.",
          "Wire lead capture to your CRM/sheet.",
        ],
        links: [
          { label: "ManyChat", href: "https://manychat.com" },
          { label: "Voiceflow", href: "https://www.voiceflow.com" },
        ],
      },
    ],
    concepts: [
      { title: "Scripted vs LLM vs hybrid", text: "Pure scripted bots are predictable but rigid; pure LLM bots are flexible but can hallucinate. The pro pattern is hybrid: scripted rails for critical paths, LLM for the messy middle." },
      { title: "Grounding with RAG", text: "Retrieval-Augmented Generation feeds the model your client's real docs/FAQ at answer time, so it speaks facts, not fiction. You'll build a simple RAG pipeline." },
      { title: "Lead qualification logic", text: "A bot earns its fee by qualifying. You'll design questions that score a lead (budget, timeline, fit) and route hot leads to booking, cold ones to nurture." },
    ],
    projects: [
      { title: "Website lead-qualifying bot", brief: "A web chat that greets visitors, answers from the client's content, qualifies, and books a call.", steps: [
        "Build the flow in Voiceflow with a greeting + quick replies.",
        "Add an OpenAI step grounded in the client's FAQ.",
        "Capture name/email and push to a sheet/CRM.",
        "Embed a Calendly/Cal.com booking step for hot leads.",
        "Add a 'talk to a human' fallback.",
      ] },
      { title: "WhatsApp booking bot", brief: "A WhatsApp bot that answers FAQs and books appointments.", steps: [
        "Connect a WhatsApp number via ManyChat/provider.",
        "Build qualify → answer → book flow.",
        "Send a confirmation + reminder sequence.",
      ] },
    ],
    clientNiche: "local service businesses, clinics, agencies and e-com stores",
    priceAnchor: "$500–$2,500 setup + $100–$500/mo management",
    advanced: [
      "Vector databases (pgvector/Pinecone) for large knowledge bases",
      "Function-calling so the bot can take actions (book, refund, look up orders)",
      "Multi-language bots and tone control per brand",
      "Analytics: tracking containment rate and booked-call conversion",
    ],
    stayCurrent: [
      { label: "OpenAI Blog", href: "https://openai.com/blog" },
      { label: "Anthropic News", href: "https://www.anthropic.com/news" },
    ],
  },

  {
    slug: "gohighlevel",
    icon: "🎯",
    title: "GoHighLevel",
    category: "CRM & Funnels",
    tagline: "Run an entire agency stack, CRM, funnels, pipelines, automations, in one platform.",
    level: "Intermediate",
    outcomes: [
      "Build funnels, pipelines and automations inside GHL",
      "Set up calendars, forms and reputation/review flows",
      "Run GHL as a SaaS offer for your own clients",
    ],
    tools: [
      { name: "GoHighLevel", what: "All-in-one CRM/funnel/automation platform for agencies.", steps: [
        "Start a GHL trial and create a sub-account for a client.",
        "Build a funnel: opt-in → thank-you with a form.",
        "Create a pipeline with stages and automation triggers.",
        "Set up a calendar and connect it to a booking funnel.",
        "Build a missed-call-text-back automation.",
      ], links: [
        { label: "GoHighLevel", href: "https://www.gohighlevel.com" },
        { label: "Help docs", href: "https://help.gohighlevel.com" },
      ] },
    ],
    concepts: [
      { title: "Sub-accounts & snapshots", text: "Agencies scale GHL by cloning proven setups (snapshots) into new client sub-accounts in minutes." },
      { title: "Triggers & workflows", text: "GHL's automation builder reacts to events (form filled, stage changed) to send SMS/email and move records." },
      { title: "Pipelines as revenue maps", text: "A pipeline is a visual money map; designing stages well is what makes follow-up automatic." },
    ],
    projects: [
      { title: "Client onboarding snapshot", brief: "A reusable snapshot: funnel, pipeline, calendar, nurture automation.", steps: [
        "Build the funnel + form.",
        "Add a 5-message nurture workflow.",
        "Wire missed-call-text-back + review request.",
        "Export as a snapshot for reuse.",
      ] },
    ],
    clientNiche: "local businesses and small agencies wanting one system",
    priceAnchor: "$500–$2,000 setup + $297–$997/mo SaaS",
    advanced: [
      "Reselling GHL as your own white-label SaaS",
      "Advanced workflow logic with conditions and wait steps",
      "Reporting dashboards and attribution",
    ],
    stayCurrent: [
      { label: "GHL Ideas/Changelog", href: "https://ideas.gohighlevel.com" },
    ],
  },

  {
    slug: "ai-video-production",
    icon: "🎬",
    title: "AI Video Production",
    category: "AI Media",
    tagline: "Produce UGC ads, faceless videos and AI avatars at scale.",
    level: "Beginner",
    outcomes: [
      "Generate scripts, voiceovers and AI avatars",
      "Edit fast with AI-assisted tools",
      "Sell short-form video as a productised service",
    ],
    tools: [
      { name: "HeyGen", what: "AI avatar + voice video generation.", steps: [
        "Create an account and pick an avatar.",
        "Paste a script and generate a talking-head video.",
        "Clone a voice (with permission) for brand consistency.",
        "Export and caption.",
      ], links: [{ label: "HeyGen", href: "https://www.heygen.com" }] },
      { name: "ElevenLabs", what: "Realistic AI voiceover and voice cloning.", steps: [
        "Create a voice or pick a preset.",
        "Generate a voiceover from your script.",
        "Tune stability/clarity and export.",
      ], links: [{ label: "ElevenLabs", href: "https://elevenlabs.io" }] },
      { name: "CapCut", what: "Fast editing, captions and effects.", steps: [
        "Import clips and voiceover.",
        "Auto-caption and style the text.",
        "Add b-roll, music and export vertical 9:16.",
      ], links: [{ label: "CapCut", href: "https://www.capcut.com" }] },
    ],
    concepts: [
      { title: "Hook–retain–CTA structure", text: "Short-form lives or dies on the first 2 seconds. You'll script hooks that stop the scroll." },
      { title: "Faceless vs UGC vs avatar", text: "Three formats with different costs and trust levels, pick per client and budget." },
      { title: "Batch production", text: "Pros don't make one video; they make ten in one session with templates." },
    ],
    projects: [
      { title: "10 UGC-style ads in a day", brief: "Batch-produce ten short ad variations for one product.", steps: [
        "Write 10 hooks for one offer.",
        "Generate voiceovers in ElevenLabs.",
        "Assemble in CapCut with b-roll + captions.",
        "Export all in 9:16.",
      ] },
    ],
    clientNiche: "e-com brands, coaches and local businesses needing reels/ads",
    priceAnchor: "$30–$150 per video or $1k–$3k/mo content packages",
    advanced: [
      "AI b-roll with Runway/Pika",
      "Repurposing one long video into 20 shorts",
      "Performance creative: testing hooks systematically",
    ],
    stayCurrent: [
      { label: "Runway", href: "https://runwayml.com" },
    ],
  },

  {
    slug: "wordpress-development",
    icon: "🌐",
    title: "WordPress Development",
    category: "Web",
    tagline: "Build fast, high-converting WordPress sites clients love.",
    level: "Beginner",
    outcomes: [
      "Build and host a professional WordPress site",
      "Design with a page builder and optimise speed/SEO",
      "Hand off a maintainable site clients can edit",
    ],
    tools: [
      { name: "WordPress", what: "The CMS powering ~40% of the web.", steps: [
        "Get hosting (Hostinger/SiteGround) and install WordPress.",
        "Pick a lightweight theme (e.g. Hello/Astra).",
        "Set permalinks, install essential plugins (SEO, caching, forms).",
        "Create core pages and a menu.",
      ], links: [{ label: "WordPress docs", href: "https://wordpress.org/documentation/" }] },
      { name: "Elementor", what: "Visual drag-and-drop page builder.", steps: [
        "Install Elementor and a starter kit.",
        "Build a homepage section-by-section.",
        "Make it responsive across breakpoints.",
        "Save sections as reusable templates.",
      ], links: [{ label: "Elementor", href: "https://elementor.com" }] },
    ],
    concepts: [
      { title: "Themes, plugins & the block editor", text: "How WordPress is assembled, and which plugins to trust vs avoid for speed/security." },
      { title: "Performance & Core Web Vitals", text: "Caching, image optimisation and lazy loading to pass Google's speed checks." },
      { title: "Security basics", text: "Updates, strong logins, backups and a firewall plugin keep client sites safe." },
    ],
    projects: [
      { title: "5-page business site", brief: "Home, About, Services, Portfolio, Contact, fast and responsive.", steps: [
        "Set up hosting + WordPress.",
        "Build pages in Elementor.",
        "Add a contact form + SEO + caching.",
        "Run a speed test and optimise.",
      ] },
    ],
    clientNiche: "local businesses, restaurants, clinics and consultants",
    priceAnchor: "$500–$3,000 per site + care plans",
    advanced: [
      "Custom WooCommerce stores",
      "ACF + custom post types for dynamic content",
      "Staging, version control and client care plans",
    ],
    stayCurrent: [
      { label: "WordPress News", href: "https://wordpress.org/news/" },
    ],
  },

  {
    slug: "ecommerce-solutions",
    icon: "🛒",
    title: "E-commerce Solutions",
    category: "Web",
    tagline: "Design and optimise online stores that actually convert.",
    level: "Intermediate",
    outcomes: [
      "Launch a Shopify/WooCommerce store end-to-end",
      "Optimise product pages and checkout for conversions",
      "Set up email/SMS flows that recover revenue",
    ],
    tools: [
      { name: "Shopify", what: "The fastest path to a professional store.", steps: [
        "Start a trial and pick a theme.",
        "Add products with strong images + copy.",
        "Set up payments, shipping and taxes.",
        "Install reviews + an upsell app.",
        "Launch and place a test order.",
      ], links: [{ label: "Shopify", href: "https://www.shopify.com" }, { label: "Help", href: "https://help.shopify.com" }] },
    ],
    concepts: [
      { title: "Conversion anatomy of a store", text: "Where money leaks: product page, cart, checkout. You'll learn to plug each." },
      { title: "Offers & AOV", text: "Bundles, upsells and free-shipping thresholds raise average order value." },
      { title: "Retention flows", text: "Abandoned-cart and post-purchase flows are the highest-ROI work you can do." },
    ],
    projects: [
      { title: "Launch a niche store", brief: "A small store with optimised PDP and recovery flows.", steps: [
        "Build the store + 3 products.",
        "Write conversion-focused PDP copy.",
        "Set up abandoned-cart email/SMS.",
        "Add reviews + an upsell.",
      ] },
    ],
    clientNiche: "DTC brands and creators selling products",
    priceAnchor: "$1,000–$5,000 build + CRO retainers",
    advanced: [
      "Headless commerce basics",
      "Conversion testing with real data",
      "Subscriptions and LTV optimisation",
    ],
    stayCurrent: [
      { label: "Shopify Changelog", href: "https://changelog.shopify.com" },
    ],
  },

  {
    slug: "social-media-automation",
    icon: "📱",
    title: "Social Media Automation",
    category: "Marketing",
    tagline: "Run content systems that post and engage daily without you.",
    level: "Beginner",
    outcomes: [
      "Build a content engine and scheduling system",
      "Repurpose one idea into many platform-native posts",
      "Automate DMs and lead capture",
    ],
    tools: [
      { name: "Make / Zapier", what: "Connect content tools and schedulers.", steps: [
        "Trigger on a new row in a content sheet.",
        "Format per platform.",
        "Push to a scheduler (Buffer/Metricool) via API.",
      ], links: [{ label: "Make", href: "https://www.make.com" }, { label: "Zapier", href: "https://zapier.com" }] },
      { name: "ManyChat", what: "Automate Instagram/Facebook DMs and comment triggers.", steps: [
        "Connect IG/FB.",
        "Build a comment-to-DM lead magnet flow.",
        "Capture emails and tag leads.",
      ], links: [{ label: "ManyChat", href: "https://manychat.com" }] },
    ],
    concepts: [
      { title: "Content pillars & batching", text: "Decide 3–4 pillars, batch a month in one sitting, schedule it out." },
      { title: "Repurposing engine", text: "One long-form → many shorts/posts is the highest-leverage content system." },
      { title: "Engagement automation ethics", text: "Automate the boring (scheduling, FAQ DMs), keep real conversation human." },
    ],
    projects: [
      { title: "30-day content engine", brief: "A sheet + automation that schedules a month of posts.", steps: [
        "Set up the content sheet with pillars.",
        "Build the Make/Zapier scheduling flow.",
        "Add a comment-to-DM lead magnet.",
      ] },
    ],
    clientNiche: "coaches, creators and local brands",
    priceAnchor: "$500–$2,000/mo management",
    advanced: [
      "AI-assisted content generation pipelines",
      "Analytics-driven content iteration",
      "Cross-posting with platform-native formatting",
    ],
    stayCurrent: [
      { label: "Buffer Resources", href: "https://buffer.com/resources" },
    ],
  },

  {
    slug: "youtube-automation",
    icon: "▶️",
    title: "YouTube Automation",
    category: "Marketing",
    tagline: "Build faceless YouTube channels and publishing systems that grow on autopilot.",
    level: "Intermediate",
    outcomes: [
      "Research niches and validate channel ideas",
      "Build a script→voice→edit→publish pipeline",
      "Optimise titles, thumbnails and retention",
    ],
    tools: [
      { name: "TubeBuddy / vidIQ", what: "Keyword and competition research for YouTube.", steps: [
        "Install the extension.",
        "Research a niche's search volume + competition.",
        "Validate 10 video ideas.",
      ], links: [{ label: "vidIQ", href: "https://vidiq.com" }] },
      { name: "ElevenLabs + CapCut", what: "Voiceover and editing for faceless videos.", steps: [
        "Write a retention-first script.",
        "Generate voiceover.",
        "Edit with b-roll + captions.",
      ], links: [{ label: "ElevenLabs", href: "https://elevenlabs.io" }, { label: "CapCut", href: "https://www.capcut.com" }] },
    ],
    concepts: [
      { title: "Packaging = title + thumbnail", text: "Most videos fail at packaging, not content. You'll learn click-worthy, honest packaging." },
      { title: "Retention curves", text: "Reading retention graphs to fix where viewers drop off." },
      { title: "Channel as a system", text: "A repeatable production pipeline beats sporadic genius." },
    ],
    projects: [
      { title: "Launch a faceless channel", brief: "Niche, 3 packaged videos and a publishing pipeline.", steps: [
        "Pick + validate a niche.",
        "Script and produce 3 videos.",
        "Design thumbnails and schedule uploads.",
      ] },
    ],
    clientNiche: "creators and businesses wanting a YouTube presence",
    priceAnchor: "$1k–$5k setup + per-video or retainer",
    advanced: [
      "Hiring and managing editors",
      "Monetisation beyond AdSense",
      "Data-driven topic selection",
    ],
    stayCurrent: [
      { label: "YouTube Creators", href: "https://www.youtube.com/creators/" },
    ],
  },

  {
    slug: "email-marketing",
    icon: "📧",
    title: "Email Marketing",
    category: "Marketing",
    tagline: "Write and automate email sequences that nurture and close on autopilot.",
    level: "Beginner",
    outcomes: [
      "Build lists, segments and automated flows",
      "Write emails that get opened and clicked",
      "Set up welcome, nurture and sales sequences",
    ],
    tools: [
      { name: "Mailchimp / Klaviyo", what: "Email platforms for broadcasts and automations.", steps: [
        "Create an account and import/clean a list.",
        "Set up a signup form + double opt-in.",
        "Build a 5-email welcome automation.",
        "Create segments and a broadcast.",
      ], links: [{ label: "Mailchimp", href: "https://mailchimp.com" }, { label: "Klaviyo", href: "https://www.klaviyo.com" }] },
    ],
    concepts: [
      { title: "List health & deliverability", text: "Clean lists, authentication (SPF/DKIM) and engagement keep you out of spam." },
      { title: "The core sequences", text: "Welcome, nurture, sales, win-back, the flows every business needs." },
      { title: "Subject lines & copy", text: "Open rate is the subject line's job; clicks are the body's. You'll practise both." },
    ],
    projects: [
      { title: "Welcome + sales sequence", brief: "A 7-email automated sequence for a product/offer.", steps: [
        "Map the sequence goals.",
        "Write 7 emails.",
        "Build the automation + segments.",
      ] },
    ],
    clientNiche: "e-com brands, coaches and newsletters",
    priceAnchor: "$500–$2,500 setup + retainers",
    advanced: [
      "Behaviour-based flows and dynamic content",
      "A/B testing and revenue attribution",
      "SMS + email cross-channel",
    ],
    stayCurrent: [
      { label: "Really Good Emails", href: "https://reallygoodemails.com" },
    ],
  },

  {
    slug: "analytics-tracking",
    icon: "📊",
    title: "Analytics & Tracking",
    category: "Data",
    tagline: "Know exactly what's working with clean, trustworthy tracking.",
    level: "Intermediate",
    outcomes: [
      "Set up GA4 + Tag Manager correctly",
      "Track conversions and build useful dashboards",
      "Make decisions from data, not vibes",
    ],
    tools: [
      { name: "Google Analytics 4", what: "Event-based web analytics.", steps: [
        "Create a GA4 property + data stream.",
        "Install via GTM.",
        "Mark key events as conversions.",
        "Build an exploration report.",
      ], links: [{ label: "GA4 Help", href: "https://support.google.com/analytics" }] },
      { name: "Google Tag Manager", what: "Manage all tracking tags without code.", steps: [
        "Create a GTM container and install the snippet.",
        "Add the GA4 config tag.",
        "Create triggers for clicks/form submits.",
        "Use Preview mode to verify, then publish.",
      ], links: [{ label: "GTM", href: "https://tagmanager.google.com" }] },
    ],
    concepts: [
      { title: "Events & conversions", text: "GA4 is event-based; you'll define what counts as a conversion and why." },
      { title: "Attribution basics", text: "Understanding which channel gets credit, and the limits of tracking." },
      { title: "Dashboards that drive action", text: "Reports nobody reads are waste; you'll build ones that change decisions." },
    ],
    projects: [
      { title: "Full tracking setup", brief: "GA4 + GTM + conversion tracking + a one-page dashboard.", steps: [
        "Install GTM + GA4.",
        "Track form + button conversions.",
        "Build a Looker Studio dashboard.",
      ] },
    ],
    clientNiche: "any business spending on ads or content",
    priceAnchor: "$500–$2,000 setup + reporting retainers",
    advanced: [
      "Server-side tagging",
      "Consent mode & privacy compliance",
      "BigQuery export for advanced analysis",
    ],
    stayCurrent: [
      { label: "Analytics Mania", href: "https://www.analyticsmania.com" },
    ],
  },

  {
    slug: "zapier-make",
    icon: "🔄",
    title: "Zapier & Make Setup",
    category: "Automation",
    tagline: "Connect any tools with no-code automation that just works.",
    level: "Beginner",
    outcomes: [
      "Build reliable Zaps and Make scenarios",
      "Handle errors, filters and multi-step logic",
      "Sell quick-win automations to any business",
    ],
    tools: [
      { name: "Zapier", what: "The most popular no-code automation tool.", steps: [
        "Create an account and pick a trigger app.",
        "Build a 3-step Zap with a filter.",
        "Use Formatter to reshape data.",
        "Turn on + monitor task history.",
      ], links: [{ label: "Zapier", href: "https://zapier.com" }, { label: "Help", href: "https://help.zapier.com" }] },
      { name: "Make", what: "Visual, cheaper-at-scale automation with more control.", steps: [
        "Create a scenario on the canvas.",
        "Add modules + routers for branching.",
        "Add error handlers.",
        "Schedule and run.",
      ], links: [{ label: "Make", href: "https://www.make.com" }] },
    ],
    concepts: [
      { title: "Triggers, actions, filters", text: "The building blocks shared by every no-code tool." },
      { title: "Zapier vs Make vs n8n", text: "When each wins on price, control and complexity." },
      { title: "Reliability & error handling", text: "Designing automations that fail loudly, not silently." },
    ],
    projects: [
      { title: "5 quick-win automations", brief: "Five common business automations a client will pay for today.", steps: [
        "Form → CRM → Slack.",
        "New sale → invoice + thank-you.",
        "Calendar booking → reminder sequence.",
        "Lead → enrich → tag.",
        "Daily report digest.",
      ] },
    ],
    clientNiche: "small businesses with disconnected tools",
    priceAnchor: "$150–$1,000 per automation",
    advanced: [
      "Webhooks and API modules",
      "Data stores and aggregation",
      "Cost optimisation at scale",
    ],
    stayCurrent: [
      { label: "Make Academy", href: "https://www.make.com/en/academy" },
    ],
  },

  {
    slug: "crm-implementation",
    icon: "💼",
    title: "CRM Implementation",
    category: "CRM & Funnels",
    tagline: "Set up CRMs and pipelines so no lead is ever dropped.",
    level: "Intermediate",
    outcomes: [
      "Design pipelines that match a real sales process",
      "Automate follow-ups and lead routing",
      "Migrate data and train the team",
    ],
    tools: [
      { name: "HubSpot", what: "Popular CRM with a strong free tier.", steps: [
        "Create a free HubSpot account.",
        "Define pipeline stages.",
        "Import contacts + deals.",
        "Build a follow-up sequence + tasks.",
      ], links: [{ label: "HubSpot", href: "https://www.hubspot.com" }] },
    ],
    concepts: [
      { title: "Pipeline design", text: "Stages should mirror how deals actually move, not wishful thinking." },
      { title: "Automation vs manual", text: "Automate reminders/routing; keep judgement human." },
      { title: "Adoption is the hard part", text: "A CRM only works if the team uses it, you'll plan for that." },
    ],
    projects: [
      { title: "CRM from scratch", brief: "Pipeline, automations and a clean import for one business.", steps: [
        "Map their sales process.",
        "Build the pipeline + properties.",
        "Add follow-up automation.",
        "Import and verify data.",
      ] },
    ],
    clientNiche: "sales teams and service businesses",
    priceAnchor: "$1,000–$5,000 setup + retainers",
    advanced: [
      "Lead scoring and routing",
      "Reporting and forecasting",
      "Integrations with marketing/ops tools",
    ],
    stayCurrent: [
      { label: "HubSpot Blog", href: "https://blog.hubspot.com" },
    ],
  },

  {
    slug: "document-automation",
    icon: "📄",
    title: "Document Automation",
    category: "Automation",
    tagline: "Generate proposals, contracts and reports on autopilot.",
    level: "Beginner",
    outcomes: [
      "Auto-generate documents from data",
      "Build proposal/contract pipelines",
      "Save clients hours of repetitive admin",
    ],
    tools: [
      { name: "Google Docs/Sheets API + Make", what: "Template-driven document generation.", steps: [
        "Create a Google Doc template with {{placeholders}}.",
        "Build a Make scenario that fills the template.",
        "Export to PDF and email/store it.",
      ], links: [{ label: "Make", href: "https://www.make.com" }] },
      { name: "PandaDoc / DocuSign", what: "E-signatures and proposal tracking.", steps: [
        "Create a reusable proposal template.",
        "Add signature + payment blocks.",
        "Automate send + reminders.",
      ], links: [{ label: "PandaDoc", href: "https://www.pandadoc.com" }] },
    ],
    concepts: [
      { title: "Templates + merge data", text: "The core pattern: a template plus a data source equals infinite documents." },
      { title: "Where docs leak time", text: "Proposals, invoices, reports, onboarding, the repetitive paperwork to automate." },
      { title: "Signatures & compliance", text: "Legally-sound e-sign flows and record-keeping." },
    ],
    projects: [
      { title: "Auto-proposal system", brief: "From a form to a sent, signable proposal automatically.", steps: [
        "Build the template.",
        "Wire form → document → e-sign.",
        "Add reminders + storage.",
      ] },
    ],
    clientNiche: "agencies, consultants and B2B service firms",
    priceAnchor: "$300–$2,000 per system",
    advanced: [
      "AI-drafted proposals from a brief",
      "Dynamic pricing tables",
      "Bulk report generation",
    ],
    stayCurrent: [
      { label: "Make Templates", href: "https://www.make.com/en/templates" },
    ],
  },

  {
    slug: "ai-identity-design",
    icon: "🎨",
    title: "AI Identity Design",
    category: "AI Media",
    tagline: "Create standout brand identities and visuals with AI tools.",
    level: "Beginner",
    outcomes: [
      "Generate logos, palettes and brand systems with AI",
      "Produce on-brand marketing visuals fast",
      "Deliver a brand kit clients love",
    ],
    tools: [
      { name: "Midjourney", what: "State-of-the-art AI image generation.", steps: [
        "Join and learn prompt structure.",
        "Generate moodboards + concepts.",
        "Use style references for consistency.",
        "Upscale and refine.",
      ], links: [{ label: "Midjourney", href: "https://www.midjourney.com" }] },
      { name: "Canva", what: "Assemble brand kits and marketing assets.", steps: [
        "Build a brand kit (colours/fonts/logo).",
        "Create templates for social/ads.",
        "Export and share with the client.",
      ], links: [{ label: "Canva", href: "https://www.canva.com" }] },
    ],
    concepts: [
      { title: "Brand systems, not just logos", text: "Identity is colour, type, voice and usage, you'll deliver the system." },
      { title: "Prompting for consistency", text: "Style refs and seeds keep AI visuals on-brand." },
      { title: "Taste + tools", text: "AI does the pixels; your design judgement is the value." },
    ],
    projects: [
      { title: "Full brand kit", brief: "Logo concepts, palette, type and templates for one brand.", steps: [
        "Generate concepts in Midjourney.",
        "Refine the direction.",
        "Assemble a brand kit in Canva.",
      ] },
    ],
    clientNiche: "startups, creators and rebranding small businesses",
    priceAnchor: "$300–$2,500 per brand package",
    advanced: [
      "Consistent character/product generation",
      "Motion and video branding",
      "Brand guideline documents",
    ],
    stayCurrent: [
      { label: "Midjourney Updates", href: "https://www.midjourney.com/updates" },
    ],
  },

  {
    slug: "lead-generation",
    icon: "📈",
    title: "Lead Generation",
    category: "Marketing",
    tagline: "Build systems that bring consistent inbound leads without cold calling.",
    level: "Intermediate",
    outcomes: [
      "Build lead magnets and capture funnels",
      "Run outbound + inbound lead systems",
      "Qualify and route leads automatically",
    ],
    tools: [
      { name: "Apollo / Instantly", what: "Outbound prospecting and cold email at scale.", steps: [
        "Build a target list with filters.",
        "Warm up a sending domain.",
        "Write a short value-first sequence.",
        "Launch and track replies.",
      ], links: [{ label: "Apollo", href: "https://www.apollo.io" }, { label: "Instantly", href: "https://instantly.ai" }] },
    ],
    concepts: [
      { title: "Inbound vs outbound", text: "Two engines; the best systems blend both." },
      { title: "Lead magnets that convert", text: "Specific, fast-value offers beat generic ebooks." },
      { title: "Qualification & routing", text: "Score leads and send hot ones straight to booking." },
    ],
    projects: [
      { title: "Lead engine", brief: "A lead magnet + capture + qualification + routing system.", steps: [
        "Create a lead magnet + landing page.",
        "Wire capture → CRM → routing.",
        "Add a nurture sequence.",
      ] },
    ],
    clientNiche: "B2B services and agencies needing pipeline",
    priceAnchor: "$1,000–$5,000 setup + per-lead/retainer",
    advanced: [
      "Deliverability mastery",
      "Multi-channel sequences",
      "AI personalisation at scale",
    ],
    stayCurrent: [
      { label: "Instantly Blog", href: "https://instantly.ai/blog" },
    ],
  },

  {
    slug: "automation-strategy",
    icon: "🧠",
    title: "Automation Strategy",
    category: "Automation",
    tagline: "Audit a business and design a blueprint to automate it end-to-end.",
    level: "Advanced",
    outcomes: [
      "Map a business's processes and find automation ROI",
      "Prioritise and sequence an automation roadmap",
      "Sell strategy as a high-value standalone offer",
    ],
    tools: [
      { name: "Whimsical / Miro", what: "Process mapping and blueprinting.", steps: [
        "Map a business's core workflows.",
        "Flag manual, repetitive, error-prone steps.",
        "Design the automated future-state.",
      ], links: [{ label: "Miro", href: "https://miro.com" }] },
    ],
    concepts: [
      { title: "Process mapping", text: "You can't automate what you can't see; mapping comes first." },
      { title: "ROI prioritisation", text: "Automate by impact × frequency × ease, not by what's shiny." },
      { title: "Change management", text: "Tech is easy; getting humans to adopt it is the real work." },
    ],
    projects: [
      { title: "Automation blueprint", brief: "A full audit + prioritised roadmap for one business.", steps: [
        "Interview + map current state.",
        "Identify top 10 automations.",
        "Prioritise + sequence the roadmap.",
        "Present with ROI estimates.",
      ] },
    ],
    clientNiche: "growing SMBs and agencies",
    priceAnchor: "$1,500–$10,000 strategy engagements",
    advanced: [
      "Systems thinking for ops",
      "Tying automation to financial metrics",
      "Building an internal automation playbook",
    ],
    stayCurrent: [
      { label: "Zapier Blog", href: "https://zapier.com/blog" },
    ],
  },

  {
    slug: "vibe-coding",
    icon: "⚡",
    title: "Vibe Coding",
    category: "Web",
    tagline: "Build real products fast with AI-first development.",
    level: "Beginner",
    outcomes: [
      "Build and ship apps with AI coding tools",
      "Prompt, debug and iterate effectively",
      "Turn ideas into working MVPs in days",
    ],
    tools: [
      { name: "Cursor", what: "AI-native code editor.", steps: [
        "Install Cursor and open a project.",
        "Use chat to scaffold a feature.",
        "Learn to give it context (files, errors).",
        "Iterate with small, reviewable changes.",
      ], links: [{ label: "Cursor", href: "https://cursor.com" }] },
      { name: "Lovable", what: "Build full web apps from prompts.", steps: [
        "Describe the app you want.",
        "Iterate on UI + logic via chat.",
        "Connect a backend (Supabase).",
        "Publish.",
      ], links: [{ label: "Lovable", href: "https://lovable.dev" }] },
    ],
    concepts: [
      { title: "Thinking in features", text: "Ship one small working feature at a time, not a giant spec." },
      { title: "Prompting for code", text: "Context, constraints and examples get better output." },
      { title: "Knowing enough to debug", text: "You don't need to write every line, but you must read and verify it." },
    ],
    projects: [
      { title: "Ship an MVP in a weekend", brief: "Take an idea to a deployed working app.", steps: [
        "Define one core feature.",
        "Build the UI with AI tools.",
        "Add data with Supabase.",
        "Deploy to Vercel.",
      ] },
    ],
    clientNiche: "founders and small businesses needing custom tools",
    priceAnchor: "$1,000–$10,000 per MVP",
    advanced: [
      "Reviewing AI code for security",
      "Architecture that scales past the prototype",
      "Combining tools (Cursor + Supabase + Vercel)",
    ],
    stayCurrent: [
      { label: "Cursor Changelog", href: "https://cursor.com/changelog" },
    ],
  },

  {
    slug: "saas-web-app",
    icon: "🚀",
    title: "SaaS Web App Development",
    category: "Web",
    tagline: "Build and deploy full-stack web applications people pay for.",
    level: "Advanced",
    outcomes: [
      "Build a full-stack app with auth, DB and payments",
      "Design multi-tenant SaaS architecture",
      "Launch and iterate with real users",
    ],
    tools: [
      { name: "React + Vite", what: "Modern frontend foundation.", steps: [
        "Scaffold a Vite + React + TS app.",
        "Add routing and a component library.",
        "Build the core UI.",
      ], links: [{ label: "Vite", href: "https://vite.dev" }, { label: "React", href: "https://react.dev" }] },
      { name: "Supabase", what: "Auth, Postgres and storage backend.", steps: [
        "Create a project + schema.",
        "Add Google auth.",
        "Use row-level security for multi-tenant data.",
      ], links: [{ label: "Supabase Docs", href: "https://supabase.com/docs" }] },
      { name: "Stripe", what: "Subscriptions and billing.", steps: [
        "Create products + prices.",
        "Add Stripe Checkout.",
        "Handle webhooks for subscription state.",
      ], links: [{ label: "Stripe Docs", href: "https://stripe.com/docs" }] },
    ],
    concepts: [
      { title: "The SaaS stack", text: "Frontend, backend, auth, DB, payments, how they fit together." },
      { title: "Multi-tenancy & security", text: "Keeping each customer's data isolated and safe." },
      { title: "MVP scope discipline", text: "Ship the smallest thing that delivers the core value." },
    ],
    projects: [
      { title: "Launch a micro-SaaS", brief: "Auth + a core feature + subscriptions, deployed.", steps: [
        "Build auth + DB with Supabase.",
        "Build the core feature.",
        "Add Stripe subscriptions.",
        "Deploy to Vercel.",
      ] },
    ],
    clientNiche: "founders and businesses needing custom software",
    priceAnchor: "$5,000–$50,000 per build",
    advanced: [
      "Background jobs and queues",
      "Observability and error tracking",
      "Scaling Postgres and caching",
    ],
    stayCurrent: [
      { label: "Supabase Blog", href: "https://supabase.com/blog" },
    ],
  },

  {
    slug: "web-app-deployment",
    icon: "☁️",
    title: "Web App Deployment",
    category: "Web",
    tagline: "Deploy, host and maintain apps reliably and securely.",
    level: "Intermediate",
    outcomes: [
      "Deploy frontends and backends to production",
      "Set up domains, SSL, env vars and CI/CD",
      "Monitor, back up and keep apps healthy",
    ],
    tools: [
      { name: "Vercel", what: "Deploy frontends and serverless functions.", steps: [
        "Connect a Git repo.",
        "Configure build + env vars.",
        "Add a custom domain + SSL.",
        "Set up preview deployments.",
      ], links: [{ label: "Vercel Docs", href: "https://vercel.com/docs" }] },
      { name: "Docker + VPS", what: "Host backends/services you control.", steps: [
        "Containerise the app.",
        "Deploy to a VPS with a reverse proxy.",
        "Add HTTPS + auto-restart.",
      ], links: [{ label: "Docker Docs", href: "https://docs.docker.com" }] },
    ],
    concepts: [
      { title: "Environments & secrets", text: "Dev/staging/prod and never committing secrets." },
      { title: "CI/CD", text: "Automating tests + deploys on every push." },
      { title: "Reliability basics", text: "Backups, monitoring, rollbacks." },
    ],
    projects: [
      { title: "Production deployment", brief: "Deploy a full-stack app with domain, SSL and CI/CD.", steps: [
        "Deploy frontend to Vercel.",
        "Deploy backend (serverless or VPS).",
        "Add domain + SSL + env vars.",
        "Set up monitoring + backups.",
      ] },
    ],
    clientNiche: "developers and businesses launching apps",
    priceAnchor: "$300–$3,000 setup + maintenance retainers",
    advanced: [
      "Zero-downtime deploys",
      "Infrastructure as code",
      "Load testing and scaling",
    ],
    stayCurrent: [
      { label: "Vercel Changelog", href: "https://vercel.com/changelog" },
    ],
  },

  {
    slug: "cro-audit",
    icon: "🔍",
    title: "Conversion Rate Optimization (CRO)",
    category: "Marketing",
    tagline: "Find and fix what's quietly killing conversions.",
    level: "Intermediate",
    outcomes: [
      "Audit a site/funnel for conversion leaks",
      "Prioritise fixes by impact",
      "Run tests and prove lift with data",
    ],
    tools: [
      { name: "Hotjar / Clarity", what: "Heatmaps and session recordings.", steps: [
        "Install the tracking snippet.",
        "Watch session recordings.",
        "Find drop-off and confusion points.",
      ], links: [{ label: "Microsoft Clarity", href: "https://clarity.microsoft.com" }, { label: "Hotjar", href: "https://www.hotjar.com" }] },
    ],
    concepts: [
      { title: "The conversion equation", text: "Motivation, friction and anxiety, the levers you'll pull." },
      { title: "Qualitative + quantitative", text: "Recordings tell you why; analytics tell you how much." },
      { title: "Prioritisation frameworks", text: "ICE/PIE to decide what to fix first." },
    ],
    projects: [
      { title: "Full CRO audit", brief: "Audit a real funnel and deliver a prioritised fix list.", steps: [
        "Set up analytics + recordings.",
        "Audit the funnel step-by-step.",
        "Write a prioritised recommendations doc.",
      ] },
    ],
    clientNiche: "e-com and lead-gen businesses with traffic",
    priceAnchor: "$500–$3,000 per audit + testing retainers",
    advanced: [
      "A/B testing methodology and significance",
      "Copy + design testing",
      "Personalisation",
    ],
    stayCurrent: [
      { label: "CXL Blog", href: "https://cxl.com/blog/" },
    ],
  },

  {
    slug: "funnels-landing-pages",
    icon: "🔗",
    title: "Funnels & Landing Pages",
    category: "CRM & Funnels",
    tagline: "Build high-converting funnels that book calls and make sales.",
    level: "Beginner",
    outcomes: [
      "Design funnel flows for different goals",
      "Build fast, persuasive landing pages",
      "Connect funnels to CRM and follow-up",
    ],
    tools: [
      { name: "Framer / Webflow", what: "Design-grade landing pages, fast.", steps: [
        "Start from a template.",
        "Build a hero → proof → offer → CTA layout.",
        "Make it responsive + fast.",
        "Connect a form + analytics.",
      ], links: [{ label: "Framer", href: "https://www.framer.com" }, { label: "Webflow", href: "https://webflow.com" }] },
    ],
    concepts: [
      { title: "Funnel types", text: "Lead, sales, webinar, booking, match the funnel to the goal." },
      { title: "Landing page anatomy", text: "Hook, proof, offer, objection-handling, CTA." },
      { title: "Message-match", text: "Ad → page → offer consistency is what converts." },
    ],
    projects: [
      { title: "Booking funnel", brief: "A landing page + form + booking + follow-up.", steps: [
        "Build the page.",
        "Add a qualifying form.",
        "Connect booking + CRM.",
        "Add a follow-up sequence.",
      ] },
    ],
    clientNiche: "coaches, agencies and service businesses",
    priceAnchor: "$500–$3,000 per funnel",
    advanced: [
      "Funnel analytics and optimisation",
      "Upsell/downsell paths",
      "Dynamic personalisation",
    ],
    stayCurrent: [
      { label: "Framer Updates", href: "https://www.framer.com/updates/" },
    ],
  },

  {
    slug: "booking-systems",
    icon: "📞",
    title: "Booking Systems",
    category: "Automation",
    tagline: "Automated appointment systems that fill calendars without back-and-forth.",
    level: "Beginner",
    outcomes: [
      "Set up self-serve booking with reminders",
      "Reduce no-shows with automation",
      "Integrate booking into funnels and CRMs",
    ],
    tools: [
      { name: "Cal.com / Calendly", what: "Scheduling that syncs calendars and reminders.", steps: [
        "Connect your calendar.",
        "Create event types + availability.",
        "Add intake questions + reminders.",
        "Embed on a page.",
      ], links: [{ label: "Cal.com", href: "https://cal.com" }, { label: "Calendly", href: "https://calendly.com" }] },
    ],
    concepts: [
      { title: "Reducing friction", text: "Fewer clicks to book = more bookings." },
      { title: "No-show reduction", text: "Reminders, confirmations and deposits cut no-shows." },
      { title: "Routing & round-robin", text: "Distributing bookings across a team fairly." },
    ],
    projects: [
      { title: "Booking automation", brief: "Booking + reminders + CRM + no-show follow-up.", steps: [
        "Set up booking + intake.",
        "Add reminder sequence.",
        "Connect CRM + no-show follow-up.",
      ] },
    ],
    clientNiche: "clinics, salons, coaches and consultants",
    priceAnchor: "$200–$1,500 setup",
    advanced: [
      "Payment-on-booking",
      "Team routing",
      "Multi-location scheduling",
    ],
    stayCurrent: [
      { label: "Cal.com Blog", href: "https://cal.com/blog" },
    ],
  },

  {
    slug: "revops-systems",
    icon: "🤝",
    title: "RevOps Systems",
    category: "CRM & Funnels",
    tagline: "Align marketing, sales and ops for predictable revenue.",
    level: "Advanced",
    outcomes: [
      "Connect marketing, sales and ops data",
      "Build dashboards and forecasts leaders trust",
      "Remove friction across the revenue engine",
    ],
    tools: [
      { name: "HubSpot / GHL + BI", what: "Unify the revenue stack and report on it.", steps: [
        "Map the full lead-to-cash flow.",
        "Connect CRM + marketing + finance data.",
        "Build a revenue dashboard.",
        "Set up forecasting.",
      ], links: [{ label: "HubSpot", href: "https://www.hubspot.com" }] },
    ],
    concepts: [
      { title: "The revenue engine", text: "Marketing → sales → success as one connected system." },
      { title: "Data as the foundation", text: "Clean, connected data is what makes RevOps possible." },
      { title: "Friction removal", text: "Finding and fixing handoff gaps that lose revenue." },
    ],
    projects: [
      { title: "RevOps blueprint", brief: "Map, connect and dashboard one business's revenue engine.", steps: [
        "Map lead-to-cash.",
        "Connect the data sources.",
        "Build the dashboard + forecast.",
      ] },
    ],
    clientNiche: "scaling B2B companies and agencies",
    priceAnchor: "$3,000–$25,000 engagements",
    advanced: [
      "Attribution modelling",
      "Forecasting accuracy",
      "Cross-team SLAs and automation",
    ],
    stayCurrent: [
      { label: "RevOps Co-op", href: "https://www.revopscoop.com" },
    ],
  },

  {
    slug: "ai-agents",
    icon: "🧩",
    title: "AI Agents",
    category: "AI",
    tagline: "Build autonomous AI agents for sales, support and research.",
    level: "Advanced",
    outcomes: [
      "Design agents that take real actions via tools",
      "Build multi-step, memory-enabled agents",
      "Deploy agents safely with guardrails",
    ],
    tools: [
      { name: "OpenAI / Claude APIs", what: "The reasoning engines for agents.", steps: [
        "Get an API key and test tool/function calling.",
        "Define tools the agent can call.",
        "Add a loop: plan → act → observe.",
        "Add guardrails and spend limits.",
      ], links: [{ label: "OpenAI", href: "https://platform.openai.com/docs" }, { label: "Claude API", href: "https://docs.anthropic.com" }] },
      { name: "n8n / LangChain", what: "Orchestrate agent steps and tools.", steps: [
        "Wire an agent flow with tool nodes.",
        "Add memory/state.",
        "Test on a real task.",
      ], links: [{ label: "n8n", href: "https://docs.n8n.io" }, { label: "LangChain", href: "https://www.langchain.com" }] },
    ],
    concepts: [
      { title: "Agents vs workflows", text: "When you need reasoning/decisions vs fixed steps." },
      { title: "Tools & function calling", text: "Giving an LLM the ability to act, not just talk." },
      { title: "Guardrails & evals", text: "Keeping autonomous agents safe and measuring quality." },
    ],
    projects: [
      { title: "Build a research/support agent", brief: "An agent that uses tools to complete a real task autonomously.", steps: [
        "Define the task + tools.",
        "Build the agent loop.",
        "Add memory + guardrails.",
        "Evaluate on real inputs.",
      ] },
    ],
    clientNiche: "tech-forward businesses and SaaS teams",
    priceAnchor: "$2,000–$20,000 per agent system",
    advanced: [
      "Multi-agent systems",
      "RAG + tools combined",
      "Evals, monitoring and cost control",
    ],
    stayCurrent: [
      { label: "Anthropic Engineering", href: "https://www.anthropic.com/engineering" },
      { label: "OpenAI Blog", href: "https://openai.com/blog" },
    ],
  },

  /* ================================================================
     NEW for 2026, future-facing AI skills. The IT world moved fast,
     so these are the skills with the most demand and the longest runway.
     ================================================================ */

  {
    slug: "ai-ugc-ads",
    icon: "🎥",
    title: "AI UGC & Ad Creatives",
    category: "AI Media",
    tagline: "Turn AI avatars and short clips into scroll-stopping ads, without ever being on camera.",
    level: "Beginner",
    flagship: true,
    outcomes: [
      "Script and produce UGC-style video ads without filming yourself",
      "Spin up ten ad variations in an afternoon using AI avatars and voices",
      "Package ad creative as a monthly service brands keep paying for",
    ],
    tools: [
      { name: "HeyGen", what: "AI avatars and talking-head videos in many languages.", steps: [
        "Create a free account and open the avatar library.",
        "Paste a short script and pick an avatar and voice.",
        "Generate, then download the clip.",
        "Swap the script to make a second angle of the same ad.",
      ], links: [ { label: "HeyGen", href: "https://www.heygen.com" } ] },
      { name: "Arcads / Captions", what: "Generate UGC-style ad videos and auto-captions fast.", steps: [
        "Write three hooks for the same product.",
        "Generate a UGC clip per hook.",
        "Add bold captions and a clear call to action.",
      ], links: [ { label: "Captions", href: "https://www.captions.ai" } ] },
      { name: "CapCut", what: "Free editor for hooks, captions, trims and sound.", steps: [
        "Drop your clips on the timeline.",
        "Cut the first two seconds to the strongest hook.",
        "Add captions, b-roll and a trending sound.",
      ], links: [ { label: "CapCut", href: "https://www.capcut.com" } ] },
    ],
    concepts: [
      { title: "Hook, retain, call to action", text: "Short-form ads live or die in the first two seconds. You will learn to write hooks that stop the scroll, then hold attention to the offer." },
      { title: "Angles and variations", text: "One product, many angles. Pros never run one ad, they run ten variations and let the numbers pick the winner." },
      { title: "Rough beats polished", text: "Authentic, slightly rough UGC usually out-performs glossy ads. You will learn why, and how to fake real on purpose." },
    ],
    projects: [
      { title: "Ten ad variations for one product", brief: "Batch produce ten short ad variations from a single brief.", steps: [
        "Pick a product and write ten hooks.",
        "Generate a clip per hook with an AI avatar.",
        "Caption and export all ten.",
        "Lay them out so a client can pick favourites.",
      ] },
      { title: "AI testimonial set", brief: "A set of believable AI testimonial videos for a brand.", steps: [
        "Write three short testimonial scripts.",
        "Generate each with a different avatar and voice.",
        "Add captions and brand colours.",
      ] },
    ],
    clientNiche: "e-commerce brands, app founders and local businesses running paid ads",
    priceAnchor: "$50 to $300 per video, or $1.5k to $4k a month creative packages",
    advanced: [
      "A reusable batch system that outputs ten ads from one brief",
      "A swipe file of winning ad structures by niche",
      "Reading ad performance and feeding it back into the next batch",
    ],
    stayCurrent: [
      { label: "HeyGen Blog", href: "https://www.heygen.com/blog" },
      { label: "Meta Business News", href: "https://www.facebook.com/business/news" },
    ],
  },

  {
    slug: "ai-voice-agents",
    icon: "📞",
    title: "AI Voice Agents",
    category: "AI",
    tagline: "Build AI phone agents that answer calls, book appointments and qualify leads, all day and night.",
    level: "Intermediate",
    flagship: true,
    outcomes: [
      "Design a voice agent that handles real phone conversations",
      "Connect it to calendars, CRMs and your other tools",
      "Sell it as a receptionist that never sleeps and never misses a call",
    ],
    tools: [
      { name: "Vapi", what: "Build, test and deploy AI voice agents.", steps: [
        "Create an account and start a new assistant.",
        "Write the agent's goal and a few simple rules.",
        "Give it a phone number and call it yourself.",
        "Read the transcript and tighten the prompt.",
      ], links: [ { label: "Vapi", href: "https://vapi.ai" } ] },
      { name: "ElevenLabs", what: "Natural AI voices and languages for the agent.", steps: [
        "Pick a voice that fits the brand.",
        "Test how it reads numbers, names and prices.",
        "Plug the voice into your agent.",
      ], links: [ { label: "ElevenLabs", href: "https://elevenlabs.io" } ] },
      { name: "n8n or Make", what: "The backend that books the calendar and updates the CRM.", steps: [
        "Catch the agent's result with a webhook.",
        "Create the booking in a calendar.",
        "Log the caller in a CRM or sheet.",
      ], links: [ { label: "n8n", href: "https://n8n.io" } ] },
    ],
    concepts: [
      { title: "Latency and turn-taking", text: "A good voice agent feels natural because it responds fast and does not talk over people. You will learn what makes a call feel human." },
      { title: "Intents and guardrails", text: "Agents need clear jobs and firm limits, so they book the meeting and never promise things they should not." },
      { title: "Handoff to a human", text: "The pro move is knowing when to pass a tricky call to a real person, smoothly." },
    ],
    projects: [
      { title: "AI receptionist for a clinic", brief: "A voice agent that answers, books appointments and answers common questions.", steps: [
        "Map the five most common caller questions.",
        "Build the agent and connect a calendar.",
        "Test ten real-sounding calls and fix the gaps.",
      ] },
      { title: "Outbound lead-qualifying caller", brief: "An agent that calls new leads and qualifies them.", steps: [
        "Write the qualifying questions and scoring.",
        "Connect it to a lead list.",
        "Route hot leads to a human or a booking link.",
      ] },
    ],
    clientNiche: "clinics, salons, real estate, home services and busy agencies",
    priceAnchor: "$1k to $5k setup plus $200 to $1,000 a month",
    advanced: [
      "Multi-language agents for diverse customer bases",
      "Call analytics, transcripts and quality scoring",
      "Consent, recording rules and compliance per region",
    ],
    stayCurrent: [
      { label: "Vapi Docs", href: "https://docs.vapi.ai" },
      { label: "ElevenLabs Blog", href: "https://elevenlabs.io/blog" },
    ],
  },

  {
    slug: "aeo-optimization",
    icon: "🔮",
    title: "Answer Engine Optimization (AEO)",
    category: "Marketing",
    tagline: "Get brands quoted inside ChatGPT, Perplexity and Google AI answers, this is the new SEO.",
    level: "Intermediate",
    flagship: true,
    outcomes: [
      "Make a brand the source AI assistants actually cite",
      "Structure content the way answer engines like to quote it",
      "Measure and grow a brand's visibility inside AI answers",
    ],
    tools: [
      { name: "ChatGPT and Perplexity", what: "Your testing ground, see who gets cited and why.", steps: [
        "Ask the questions a brand's customers would ask.",
        "Note which sites get cited in the answer.",
        "Spot the pattern in what those sources do well.",
      ], links: [ { label: "Perplexity", href: "https://www.perplexity.ai" } ] },
      { name: "Structured data (Schema)", what: "Markup that helps machines understand a page.", steps: [
        "Add FAQ and Article schema to key pages.",
        "Write clear question-and-answer blocks.",
        "Validate the markup before publishing.",
      ], links: [ { label: "Schema.org", href: "https://schema.org" } ] },
      { name: "AI visibility tracking", what: "Track how often a brand appears in AI answers.", steps: [
        "List the 20 questions that matter for the brand.",
        "Check answers across ChatGPT, Perplexity and Google.",
        "Log mentions weekly to see progress.",
      ], links: [ { label: "Google Search Central", href: "https://developers.google.com/search" } ] },
    ],
    concepts: [
      { title: "How answer engines pick sources", text: "AI answers favour clear, well-structured, trustworthy pages that answer the exact question. You will learn to become that page." },
      { title: "From keywords to questions", text: "Old SEO chased keywords. AEO answers real questions cleanly, because that is what gets quoted." },
      { title: "Entities and trust", text: "Being a clear, consistent entity across the web makes AI confident enough to cite you." },
    ],
    projects: [
      { title: "AEO audit and fix plan", brief: "Audit how a brand shows up in AI answers and plan the fixes.", steps: [
        "Test 20 buyer questions across the main AI tools.",
        "Score where the brand appears and where rivals win.",
        "Deliver a prioritised plan to get cited more.",
      ] },
      { title: "An answer-ready content hub", brief: "Build a cluster of pages designed to be quoted.", steps: [
        "Map the top questions into a content cluster.",
        "Write clear question-and-answer pages with schema.",
        "Re-test the AI answers after a few weeks.",
      ] },
    ],
    clientNiche: "brands losing traffic to AI answers, SaaS and local service businesses",
    priceAnchor: "$1k to $5k audits plus monthly retainers",
    advanced: [
      "Building a brand knowledge graph across the web",
      "Monitoring how often AI tools mention a brand",
      "Blending AEO with classic SEO for full coverage",
    ],
    stayCurrent: [
      { label: "Google Search Central", href: "https://developers.google.com/search/blog" },
      { label: "Perplexity Blog", href: "https://www.perplexity.ai/hub" },
    ],
  },

  {
    slug: "ai-app-building",
    icon: "⚡",
    title: "No-Code AI App Building",
    category: "Web",
    tagline: "Ship niche web apps in days using AI builders, with little to no hand coding.",
    level: "Intermediate",
    outcomes: [
      "Turn an idea into a working web app using AI builders",
      "Add logins, data and payments without deep coding",
      "Sell custom tools and small apps to real clients",
    ],
    tools: [
      { name: "Lovable", what: "Describe an app in plain English and it builds it.", steps: [
        "Describe the app you want in a few sentences.",
        "Refine it screen by screen.",
        "Connect a database and publish.",
      ], links: [ { label: "Lovable", href: "https://lovable.dev" } ] },
      { name: "Bolt.new or v0", what: "Fast AI app and interface builders.", steps: [
        "Generate a first version from a prompt.",
        "Tweak the layout and logic.",
        "Export or deploy the result.",
      ], links: [ { label: "Bolt.new", href: "https://bolt.new" } ] },
      { name: "Supabase", what: "The database, logins and storage behind your app.", steps: [
        "Create a project and a simple table.",
        "Turn on email or Google login.",
        "Connect it to your app.",
      ], links: [ { label: "Supabase", href: "https://supabase.com" } ] },
    ],
    concepts: [
      { title: "Think in features", text: "Ship one small working feature at a time instead of a giant plan, the AI builder works best this way too." },
      { title: "Prompt the builder well", text: "Clear context, constraints and examples get far better apps out of an AI builder." },
      { title: "Know enough to fix it", text: "You do not need to write every line, but you must read it and verify it works." },
    ],
    projects: [
      { title: "A niche tool app, live", brief: "Take a small useful idea to a deployed app.", steps: [
        "Pick one clear job the app does.",
        "Build it with an AI builder.",
        "Add login and publish it on a real link.",
      ] },
      { title: "A simple client dashboard", brief: "A small dashboard a client logs into.", steps: [
        "Design the one screen that matters.",
        "Wire it to a database.",
        "Hand it over with a short guide.",
      ] },
    ],
    clientNiche: "founders and small businesses needing a custom tool fast",
    priceAnchor: "$800 to $8,000 per app",
    advanced: [
      "Calling APIs and AI features from inside your app",
      "Multi-page apps with roles and permissions",
      "A clean handoff and maintenance plan for clients",
    ],
    stayCurrent: [
      { label: "Lovable Changelog", href: "https://lovable.dev" },
      { label: "Supabase Blog", href: "https://supabase.com/blog" },
    ],
  },

  {
    slug: "3d-virtual-spaces",
    icon: "🏛️",
    title: "3D & Virtual Spaces",
    category: "3D & Games",
    tagline: "Create 3D product scenes and virtual property tours people can walk right through.",
    level: "Intermediate",
    flagship: true,
    outcomes: [
      "Make 3D models and scenes using AI, fast",
      "Build virtual walkthroughs for real estate and retail",
      "Put interactive 3D on a website that loads smoothly",
    ],
    tools: [
      { name: "Spline", what: "Design and publish interactive 3D for the web.", steps: [
        "Open a new scene and add a basic shape.",
        "Add materials, lighting and a camera.",
        "Export an embed for a webpage.",
      ], links: [ { label: "Spline", href: "https://spline.design" } ] },
      { name: "Luma AI or Meshy", what: "Turn photos or text into 3D models.", steps: [
        "Capture an object from many angles, or type a prompt.",
        "Generate the 3D model.",
        "Clean it up and export it.",
      ], links: [ { label: "Luma AI", href: "https://lumalabs.ai" } ] },
      { name: "Blender (basics)", what: "The free 3D tool for fixing and finishing models.", steps: [
        "Import your model.",
        "Fix scale, materials and lighting.",
        "Export in a web-friendly format.",
      ], links: [ { label: "Blender", href: "https://www.blender.org" } ] },
    ],
    concepts: [
      { title: "Meshes, materials and light", text: "Three things make a scene feel real, the shape, the surface and the lighting. You will learn to balance all three." },
      { title: "Capture versus generate", text: "Sometimes you photograph a real object into 3D, sometimes you generate it from a prompt, you will know when to use each." },
      { title: "Performance on the web", text: "A beautiful scene is useless if it will not load. You will learn to keep 3D light and fast." },
    ],
    projects: [
      { title: "A virtual walkthrough", brief: "A tour of a property or shop people can explore.", steps: [
        "Capture or build the space.",
        "Add hotspots and a smooth camera path.",
        "Publish it as a shareable link.",
      ] },
      { title: "An interactive 3D product", brief: "A product people can spin and explore on a webpage.", steps: [
        "Model or capture the product.",
        "Add it to a Spline scene.",
        "Embed it on a simple page.",
      ] },
    ],
    clientNiche: "real estate, interior design, retail and product brands",
    priceAnchor: "$500 to $5,000 per scene or tour",
    advanced: [
      "Augmented reality previews on a phone",
      "Spatial and WebXR experiences",
      "Heavy optimization so 3D runs on any device",
    ],
    stayCurrent: [
      { label: "Spline Blog", href: "https://spline.design/blog" },
      { label: "Luma AI", href: "https://lumalabs.ai" },
    ],
  },

  {
    slug: "ai-game-creation",
    icon: "🎮",
    title: "AI Game Creation",
    category: "3D & Games",
    tagline: "Design fun, shareable games fast with AI, from simple web games to playable worlds.",
    level: "Intermediate",
    outcomes: [
      "Design a small game that is genuinely fun to play",
      "Build it quickly with AI-assisted tools",
      "Publish it and share it with a simple link",
    ],
    tools: [
      { name: "Rosebud AI", what: "Describe a game and play a first version fast.", steps: [
        "Describe a simple game idea in plain words.",
        "Play the first version it builds.",
        "Refine the rules and the look.",
      ], links: [ { label: "Rosebud AI", href: "https://rosebud.ai" } ] },
      { name: "AI coding assistant", what: "Cursor or similar to build web games with help.", steps: [
        "Start a small game with a clear goal.",
        "Ask the assistant to add one feature at a time.",
        "Test after every change.",
      ], links: [ { label: "Cursor", href: "https://cursor.com" } ] },
      { name: "Web game frameworks", what: "Phaser or Three.js for browser games.", steps: [
        "Set up a blank game canvas.",
        "Add a player and one mechanic.",
        "Add scoring and a restart.",
      ], links: [ { label: "Phaser", href: "https://phaser.io" } ] },
    ],
    concepts: [
      { title: "The core game loop", text: "Every game is a loop of action, feedback and reward. Get that loop fun and the rest follows." },
      { title: "Juice and feedback", text: "Small touches, sounds, shakes and pops, are what make a game feel good to play." },
      { title: "Ship small", text: "One great mechanic beats ten half-built ones. You will learn to scope a game you can actually finish." },
    ],
    projects: [
      { title: "A shareable web game", brief: "A simple game you can send to a friend with a link.", steps: [
        "Pick one fun mechanic.",
        "Build it with AI help.",
        "Publish it and share the link.",
      ] },
      { title: "A branded mini-game", brief: "A small game for a marketing campaign.", steps: [
        "Tie the game to a brand or offer.",
        "Add a score and a share button.",
        "Launch it as a campaign page.",
      ] },
    ],
    clientNiche: "brands wanting interactive campaigns, indie creators and educators",
    priceAnchor: "$500 to $10,000 per game or campaign",
    advanced: [
      "Simple multiplayer and leaderboards",
      "Ways to monetize a game",
      "Using AI to generate game art and sound",
    ],
    stayCurrent: [
      { label: "Rosebud AI", href: "https://rosebud.ai" },
      { label: "Unity Blog", href: "https://unity.com/blog" },
    ],
  },

  {
    slug: "genz-brand-marketing",
    icon: "🛹",
    title: "Gen Z Marketing & Brand Voice",
    category: "Marketing",
    tagline: "Build a brand voice and creative that actually lands with Gen Z, not cringe.",
    level: "Beginner",
    outcomes: [
      "Craft a brand voice and personality people want to follow",
      "Write scroll-native creative and copy that feels real",
      "Plan culture-first campaigns that ride trends at the right moment",
    ],
    tools: [
      { name: "TikTok Creative Center", what: "See what is trending and why, free.", steps: [
        "Browse trending sounds, hashtags and formats.",
        "Spot a trend that fits a brand.",
        "Save three formats to try this week.",
      ], links: [ { label: "TikTok Creative Center", href: "https://ads.tiktok.com/business/creativecenter" } ] },
      { name: "CapCut and Canva", what: "Make native-looking content fast.", steps: [
        "Start from a trending template.",
        "Swap in the brand's angle and words.",
        "Keep it rough and real, not corporate.",
      ], links: [ { label: "Canva", href: "https://www.canva.com" } ] },
      { name: "ChatGPT or Claude", what: "Brainstorm voice, hooks and captions.", steps: [
        "Describe the brand and the audience.",
        "Generate ten hooks in the brand voice.",
        "Pick and sharpen the best three by hand.",
      ], links: [ { label: "Claude", href: "https://claude.ai" } ] },
    ],
    concepts: [
      { title: "Native, not an ad", text: "Gen Z scrolls past anything that looks like an ad. You will learn to make content that fits the feed and still sells." },
      { title: "Memes, trends and timing", text: "Riding a trend a day late is worse than not at all. You will learn to spot and act on culture quickly." },
      { title: "Community over broadcast", text: "Talking with people beats talking at them. You will build brands people feel part of." },
    ],
    projects: [
      { title: "Brand voice guide plus ten posts", brief: "A short voice guide and a first batch of content.", steps: [
        "Define the brand's personality and words.",
        "Write ten posts in that voice.",
        "Show how each one fits a platform.",
      ] },
      { title: "A trend-led short campaign", brief: "A small campaign built on a current trend.", steps: [
        "Pick a trend that fits the brand.",
        "Make three pieces of native content.",
        "Plan the post timing and the hook.",
      ] },
    ],
    clientNiche: "youth brands, DTC products, apps and creators targeting under-30s",
    priceAnchor: "$500 to $3,000 a month for brand and content",
    advanced: [
      "Creator collaborations and UGC at scale",
      "Building a real community around a brand",
      "Measuring whether content truly fits the culture",
    ],
    stayCurrent: [
      { label: "TikTok Newsroom", href: "https://newsroom.tiktok.com" },
      { label: "Later Blog", href: "https://later.com/blog" },
    ],
  },

  {
    slug: "ai-personalized-outreach",
    icon: "🎯",
    title: "AI Personalized Outreach",
    category: "Marketing",
    tagline: "Send outreach that feels handwritten to thousands, using AI personalization at scale.",
    level: "Intermediate",
    outcomes: [
      "Build targeted lead lists that fit a real offer",
      "Write AI-personalized messages that actually get replies",
      "Run compliant multi-step sequences that book meetings",
    ],
    tools: [
      { name: "Clay", what: "Pull data and write AI-personalized lines at scale.", steps: [
        "Import a list of target companies.",
        "Enrich each with real details.",
        "Use AI to write a personal first line per lead.",
      ], links: [ { label: "Clay", href: "https://www.clay.com" } ] },
      { name: "Smartlead or Instantly", what: "Send and warm up email at scale, safely.", steps: [
        "Connect and warm up sending inboxes.",
        "Load your personalized sequence.",
        "Send in small daily batches.",
      ], links: [ { label: "Smartlead", href: "https://www.smartlead.ai" } ] },
      { name: "ChatGPT or Claude", what: "Draft and refine the angle and copy.", steps: [
        "Describe the offer and the buyer.",
        "Generate three message angles.",
        "Tighten the best one to sound human.",
      ], links: [ { label: "ChatGPT", href: "https://chat.openai.com" } ] },
    ],
    concepts: [
      { title: "Relevance over volume", text: "A hundred relevant messages beat ten thousand generic ones. You will learn to target sharply." },
      { title: "Real personalization", text: "A genuine first line about the actual person beats a fake mail merge every time." },
      { title: "Deliverability and rules", text: "Stay in the inbox and on the right side of the law, warm up domains and always offer an opt-out." },
    ],
    projects: [
      { title: "A campaign that books calls", brief: "A personalized email campaign for one clear offer.", steps: [
        "Build a tight target list.",
        "Write a personalized three-step sequence.",
        "Send in batches and track replies.",
      ] },
      { title: "A multi-touch sequence", brief: "A combined email and LinkedIn sequence.", steps: [
        "Map the touches across a week.",
        "Personalize the first line of each.",
        "Route warm replies to a booking link.",
      ] },
    ],
    clientNiche: "B2B services, agencies and founders who need a steady pipeline",
    priceAnchor: "$1k to $5k setup plus per-meeting or retainer",
    advanced: [
      "Signal-based outreach that triggers on real events",
      "AI that drafts replies for you to approve",
      "Testing many angles at once and scaling the winner",
    ],
    stayCurrent: [
      { label: "Clay Blog", href: "https://www.clay.com/blog" },
      { label: "Smartlead Resources", href: "https://www.smartlead.ai/blog" },
    ],
  },

  {
    slug: "ai-influencers",
    icon: "🧑‍🎤",
    title: "AI Influencers & Virtual Personas",
    category: "AI Media",
    tagline: "Create consistent AI characters and virtual influencers a brand can build on.",
    level: "Intermediate",
    outcomes: [
      "Design an AI persona that looks the same in every post",
      "Produce its photos and videos at will",
      "Grow and earn from a virtual character, ethically",
    ],
    tools: [
      { name: "Midjourney or Flux", what: "Generate a consistent character's images.", steps: [
        "Design the character's look and vibe.",
        "Use references and seeds to keep it consistent.",
        "Build a small library of base images.",
      ], links: [ { label: "Midjourney", href: "https://www.midjourney.com" } ] },
      { name: "AI video tools", what: "Bring the persona to life in motion.", steps: [
        "Animate a base image into a short clip.",
        "Keep the face and style consistent.",
        "Add a voice that matches the character.",
      ], links: [ { label: "Kling AI", href: "https://klingai.com" } ] },
      { name: "Consistency workflow", what: "Keep the character identical across content.", steps: [
        "Save your best references and prompts.",
        "Reuse the same seed and style settings.",
        "Check every post against the reference.",
      ], links: [ { label: "Flux", href: "https://blackforestlabs.ai" } ] },
    ],
    concepts: [
      { title: "Character consistency", text: "The whole game is making the same face and style appear every time, with references, seeds and trained models." },
      { title: "Storytelling and cadence", text: "A persona people follow has a personality and a posting rhythm, not just pretty pictures." },
      { title: "Disclosure and ethics", text: "Be clear that a character is AI. Trust and honesty are what keep a virtual brand alive." },
    ],
    projects: [
      { title: "Launch an AI persona", brief: "A new virtual character with a first feed of twelve posts.", steps: [
        "Design the look and personality.",
        "Produce twelve consistent posts.",
        "Write the bio and a clear AI disclosure.",
      ] },
      { title: "A brand spokesperson", brief: "A virtual face for a product or service.", steps: [
        "Match the persona to the brand.",
        "Produce a set of product posts and a video.",
        "Hand over a simple content kit.",
      ] },
    ],
    clientNiche: "brands wanting an always-on face, creators and agencies",
    priceAnchor: "$1k to $10k to build plus content retainers",
    advanced: [
      "Custom-trained character models for perfect consistency",
      "Landing brand deals for a virtual persona",
      "Running the persona across many platforms at once",
    ],
    stayCurrent: [
      { label: "Midjourney Updates", href: "https://www.midjourney.com/updates" },
      { label: "Kling AI", href: "https://klingai.com" },
    ],
  },

  {
    slug: "ai-music-voice",
    icon: "🎧",
    title: "AI Music & Voice",
    category: "AI Media",
    tagline: "Produce original music, jingles and voiceovers with AI for content and brands.",
    level: "Beginner",
    outcomes: [
      "Generate original tracks and jingles from a simple prompt",
      "Create natural voiceovers in many voices and languages",
      "Sell audio for ads, podcasts and videos",
    ],
    tools: [
      { name: "Suno", what: "Generate original songs and jingles from text.", steps: [
        "Describe the mood, style and lyrics.",
        "Generate a few versions.",
        "Pick the best and export it.",
      ], links: [ { label: "Suno", href: "https://suno.com" } ] },
      { name: "ElevenLabs", what: "Natural voiceovers and dubbing in many languages.", steps: [
        "Pick or design a voice.",
        "Paste your script and generate.",
        "Dub the same script into another language.",
      ], links: [ { label: "ElevenLabs", href: "https://elevenlabs.io" } ] },
      { name: "CapCut or Adobe Podcast", what: "Clean up and balance the final audio.", steps: [
        "Remove noise and balance the levels.",
        "Add the voice over the music.",
        "Export a clean final file.",
      ], links: [ { label: "Adobe Podcast", href: "https://podcast.adobe.com" } ] },
    ],
    concepts: [
      { title: "From prompt to song", text: "A good music prompt names the mood, the style and the structure. You will learn to steer the result, not just gamble." },
      { title: "Voice cloning and consent", text: "Cloning a voice is powerful and sensitive, you will learn to do it only with clear permission." },
      { title: "Mixing for clarity", text: "Most amateur audio fails on balance. You will learn to make voice and music sit together cleanly." },
    ],
    projects: [
      { title: "A brand jingle and variations", brief: "An original jingle with three versions.", steps: [
        "Capture the brand's mood in a prompt.",
        "Generate and pick the best track.",
        "Export three lengths for different uses.",
      ] },
      { title: "A multilingual voiceover", brief: "One ad voiced in several languages.", steps: [
        "Write the script and pick a voice.",
        "Generate the main language.",
        "Dub it into two more languages.",
      ] },
    ],
    clientNiche: "content creators, podcasters, ad agencies and small brands",
    priceAnchor: "$50 to $500 per track or voiceover, or content retainers",
    advanced: [
      "Licensing and rights you can actually sell",
      "Building a full audio brand, a sound a brand owns",
      "Batch dubbing pipelines for lots of content",
    ],
    stayCurrent: [
      { label: "Suno", href: "https://suno.com" },
      { label: "ElevenLabs Blog", href: "https://elevenlabs.io/blog" },
    ],
  },
];

export const courses: Course[] = specs.map(buildCourse);

export const categories = Array.from(new Set(courses.map((c) => c.category))).sort();

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
