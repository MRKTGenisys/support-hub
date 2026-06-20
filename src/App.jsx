import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Download,
  Grid2X2,
  Headphones,
  Info,
  Laptop,
  ListChecks,
  LockKeyhole,
  Mail,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  ThumbsDown,
  ThumbsUp,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fallbackPdfResources,
  resourceCategoryCards,
  resourceCategoryFilters,
} from "./resourceLibraryData";
import {
  staticArticles,
  staticCategories,
  staticPdfResources,
} from "./staticSupportData";

const supportHubPath = "/support-hub";
const articlePathPrefix = "/support-hub/articles";
const supportArticlePathPrefix = "/support";
const categoryPathPrefix = "/support-hub/categories";
const productionPayloadApiBaseUrl = "https://genisys-support-hub-cms.vercel.app";
const legacyPayloadApiBaseUrls = new Set(["https://aquamarine-dolphin-277499.hostingersite.com"]);
const configuredPayloadApiBaseUrl = import.meta.env.VITE_PAYLOAD_API_URL?.replace(/\/$/, "") || "";
const payloadApiBaseUrl =
  legacyPayloadApiBaseUrls.has(configuredPayloadApiBaseUrl) ||
  (!configuredPayloadApiBaseUrl && import.meta.env.PROD)
    ? productionPayloadApiBaseUrl
    : configuredPayloadApiBaseUrl;
const contactSupportUrl = "https://www.genisys.com.au/contact/";
const supportTicketUrl = "https://my.genisys.com.au/login";
const remoteSupportUrl = "https://genisys.support/remotesupport.html";

const defaultSettings = {
  heroTitle: "How can we help today?",
  heroSubtitle:
    "Search our knowledge base, check system status or get in touch with our support team.",
  searchPlaceholder: "Search articles, topics, support and status...",
  supportCTA: {
    heading: "Need support?",
    body: "Get help from the Genisys team through your preferred support channel.",
    buttonLabel: "Create a Support Ticket",
    buttonURL: supportTicketUrl,
  },
};

const iconMap = {
  "arrow-right": ArrowRight,
  "book-open": BookOpen,
  "check-circle": CheckCircle2,
  clock: Clock,
  cloud: Cloud,
  download: Download,
  "grid-2x2": Grid2X2,
  headphones: Headphones,
  info: Info,
  laptop: Laptop,
  "list-checks": ListChecks,
  lock: LockKeyhole,
  mail: Mail,
  "message-circle": MessageCircle,
  monitor: Monitor,
  phone: Phone,
  smartphone: Smartphone,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  ticket: Ticket,
  users: Users,
  wifi: Wifi,
  x: X,
};

const fallbackCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    slug: "getting-started",
    description: "Onboarding, access and first steps with Genisys support.",
    iconKey: "list-checks",
    sortOrder: 10,
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    slug: "cyber-security",
    description: "Stay informed on threats, alerts and best practices.",
    iconKey: "shield-check",
    sortOrder: 20,
  },
  {
    id: "microsoft-365",
    title: "Microsoft 365",
    slug: "microsoft-365",
    description: "Guides, how-tos and support for Microsoft 365 services.",
    iconKey: "cloud",
    sortOrder: 30,
  },
  {
    id: "managed-it-services",
    title: "Managed IT Services",
    slug: "managed-it-services",
    description: "Device support, onboarding and IT request guides.",
    iconKey: "monitor",
    sortOrder: 40,
  },
  {
    id: "connectivity-voice",
    title: "Connectivity & Voice",
    slug: "connectivity-voice",
    description: "Troubleshooting for internet, networks and voice services.",
    iconKey: "phone",
    sortOrder: 50,
  },
  {
    id: "downloads-resources",
    title: "Downloads & Resources",
    slug: "downloads-resources",
    description: "Access policies, guides and helpful downloads.",
    iconKey: "download",
    sortOrder: 60,
  },
];

const fallbackArticles = [
  {
    id: "how-to-set-up-multi-factor-authentication-mfa",
    title: "How to Set Up Multi-Factor Authentication (MFA)",
    slug: "how-to-set-up-multi-factor-authentication-mfa",
    category: "Cyber Security",
    categorySlug: "cyber-security",
    excerpt:
      "Register and manage multi-factor authentication for your Microsoft 365 account.",
    readingTime: "6 min",
    updated: "2 May 2024",
    popularArticle: true,
    tags: ["MFA", "Microsoft 365", "Cyber Security"],
    guideLayout: {
      beforeYouStart: [
        "Make sure you have access to your Genisys-managed Microsoft 365 account.",
        "Have your mobile phone available.",
        "Install the Microsoft Authenticator app if required.",
        "Allow 5-10 minutes to complete the setup.",
      ],
      steps: [
        {
          title: "Step 1: Sign in to Microsoft 365",
          checklist: [
            "Go to the Microsoft 365 sign-in page.",
            "Enter your work email address and password.",
            "Follow the prompt asking for additional security information.",
          ],
          screenshotPlaceholder: {
            enabled: true,
            label: "Microsoft 365 sign-in screen",
            icon: "monitor",
          },
        },
        {
          title: "Step 2: Choose Your Verification Method",
          infoCards: [
            {
              title: "Recommended method",
              body: "Microsoft Authenticator app",
              icon: "shield-check",
            },
            {
              title: "Alternative methods",
              body: "SMS code or phone call verification",
              icon: "phone",
            },
          ],
          callout: {
            type: "info",
            body: "Genisys recommends using the Microsoft Authenticator app where available, as it provides stronger account protection than SMS.",
          },
        },
        {
          title: "Step 3: Set Up Microsoft Authenticator",
          checklist: [
            "Open the Microsoft Authenticator app.",
            "Tap Add account.",
            "Select Work or school account.",
            "Scan the QR code shown on your computer screen.",
            "Approve the test notification.",
          ],
        },
        {
          title: "Step 4: Confirm MFA Is Working",
          checklist: [
            "Sign out of Microsoft 365.",
            "Sign back in.",
            "Confirm you receive an MFA prompt.",
            "Approve the sign-in request.",
          ],
        },
      ],
      troubleshooting: [
        {
          title: "I changed phones",
          content:
            "Use your existing verified method to sign in, then update your Microsoft 365 security information with the new device.",
        },
        {
          title: "I am not receiving prompts",
          content:
            "Check that notifications are enabled for Microsoft Authenticator, your phone has network access and the app is up to date.",
        },
      ],
      bestPracticeTips: [
        { title: "Never approve unexpected MFA prompts", icon: "shield-check" },
        { title: "Report suspicious sign-in requests", icon: "shield-check" },
        { title: "Use strong, unique passwords", icon: "shield-check" },
      ],
    },
  },
  {
    id: "teams-calling-quick-start-guide",
    title: "Teams Calling - Quick Start Guide",
    slug: "teams-calling-quick-start-guide",
    category: "Connectivity & Voice",
    categorySlug: "connectivity-voice",
    excerpt:
      "Make and receive calls, manage voicemail and configure Teams Calling.",
    readingTime: "5 min",
    updated: "30 Apr 2024",
    popularArticle: true,
    tags: ["Teams Calling", "VoIP", "Microsoft 365"],
    guideLayout: {
      beforeYouStart: [
        "Ensure your Teams Calling account has been provisioned by Genisys.",
        "Confirm you are signed into Microsoft Teams.",
        "Ensure your headset or microphone is connected.",
        "Internet connection required.",
      ],
      beforeYouStartCallout:
        "If you are unsure whether Teams Calling has been enabled for your account, contact the Genisys support team.",
      steps: [
        {
          title: "Step 1: Open Microsoft Teams",
          checklist: [
            "Launch Microsoft Teams on desktop or mobile.",
            "Sign in using your Microsoft 365 work account.",
            "Select the Calls tab from the left navigation menu.",
          ],
        },
        {
          title: "Step 2: Make a Call",
          checklist: [
            "Select Calls.",
            "Enter a name or phone number.",
            "Click the Call button.",
            "Use the dial pad for external numbers if enabled.",
          ],
        },
        {
          title: "Step 3: Configure Audio Devices",
          checklist: [
            "Open Teams Settings.",
            "Navigate to Devices.",
            "Select your preferred speaker, microphone and headset.",
            "Run a test call.",
          ],
        },
      ],
      troubleshooting: [
        {
          title: "I cannot see the Calls tab",
          content:
            "Confirm Teams Calling has been provisioned for your account and that you are signed in with your Microsoft 365 work account.",
        },
        {
          title: "Poor call quality",
          content:
            "Move to a stronger network connection, close bandwidth-heavy apps and use a wired or certified headset where possible.",
        },
      ],
      bestPracticeTips: [
        { title: "Use wired or certified headsets", icon: "headphones" },
        { title: "Keep Teams updated", icon: "check-circle" },
      ],
    },
  },
  {
    id: "outlook-not-syncing-try-these-fixes",
    title: "Outlook Not Syncing? Try These Fixes",
    slug: "outlook-not-syncing-try-these-fixes",
    category: "Microsoft 365",
    categorySlug: "microsoft-365",
    excerpt:
      "Troubleshoot common Outlook sync issues across desktop and mobile devices.",
    readingTime: "4 min",
    updated: "29 Apr 2024",
    popularArticle: true,
    tags: ["Outlook", "Microsoft 365"],
    content: {
      root: {
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Start by checking your internet connection, restarting Outlook and confirming that Microsoft 365 services are available.",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "If sync issues continue, contact Genisys support with the device name, Outlook version and any visible error messages.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "vpn-connection-setup-windows-11",
    title: "VPN Connection Setup - Windows 11",
    slug: "vpn-connection-setup-windows-11",
    category: "Managed IT Services",
    categorySlug: "managed-it-services",
    excerpt:
      "Connect securely to business resources using the Genisys-managed VPN profile.",
    readingTime: "5 min",
    updated: "27 Apr 2024",
    popularArticle: false,
    tags: ["VPN", "Windows 11", "Remote Access"],
  },
  {
    id: "what-to-do-if-you-receive-a-phishing-email",
    title: "What to Do If You Receive a Phishing Email",
    slug: "what-to-do-if-you-receive-a-phishing-email",
    category: "Cyber Security",
    categorySlug: "cyber-security",
    excerpt:
      "Identify suspicious messages, avoid unsafe links and report phishing attempts.",
    readingTime: "4 min",
    updated: "26 Apr 2024",
    popularArticle: false,
    tags: ["Phishing", "Cyber Security"],
  },
  {
    id: "downloads-resources-overview",
    title: "Downloads & Resources Overview",
    slug: "downloads-resources-overview",
    category: "Downloads & Resources",
    categorySlug: "downloads-resources",
    excerpt:
      "Find common policies, user guides and helpful documentation in one place.",
    readingTime: "2 min",
    updated: "22 Apr 2024",
    popularArticle: false,
    tags: ["Downloads", "Resources"],
  },
];

const fallbackContentCategories = staticCategories.length
  ? staticCategories
  : fallbackCategories;
const fallbackContentArticles = staticArticles.length ? staticArticles : fallbackArticles;
const fallbackContentResources = staticPdfResources.length
  ? staticPdfResources
  : fallbackPdfResources;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getIcon(iconKey, fallback = BookOpen) {
  return iconMap[slugify(iconKey)] || fallback;
}

function formatPayloadDate(value) {
  if (!value) {
    return "Recently updated";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatusUpdatedAt(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function normaliseTextRows(rows, keys = ["item", "title"]) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => {
      if (typeof row === "string") {
        return row;
      }

      for (const key of keys) {
        if (row?.[key]) {
          return row[key];
        }
      }

      return "";
    })
    .filter(Boolean);
}

function normaliseInfoCards(cards) {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .map((card) => ({
      title: typeof card === "string" ? card : card?.title || "",
      body:
        typeof card === "string"
          ? ""
          : card?.body || card?.content || card?.description || "",
      icon: typeof card === "string" ? "info" : card?.icon || "info",
    }))
    .filter((card) => card.title);
}

function normaliseRelatedArticles(articles) {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles
    .map((article) => {
      const title = typeof article === "string" ? article : article?.title || "";
      const slug =
        typeof article === "string"
          ? slugify(article)
          : article?.slug || slugify(title);
      const category =
        typeof article === "string"
          ? ""
          : typeof article?.category === "object"
            ? article.category?.title || ""
            : article?.category || "";

      return {
        title,
        category,
        href: slug ? `${articlePathPrefix}/${slug}` : "#",
      };
    })
    .filter((article) => article.title);
}

function normaliseArticleCTA(cta) {
  if (!cta?.enabled || !cta?.headline) {
    return null;
  }

  const primaryButton = cta.primaryButton?.label
    ? {
        label: cta.primaryButton.label,
        url: cta.primaryButton.url || "#",
      }
    : null;
  const secondaryButton = cta.secondaryButton?.label
    ? {
        label: cta.secondaryButton.label,
        url: cta.secondaryButton.url || "#",
      }
    : null;

  return {
    headline: cta.headline,
    description: cta.description || "",
    primaryButton,
    secondaryButton,
  };
}

function normaliseGuideLayout(layout) {
  if (!layout || layout.enabled === false) {
    return null;
  }

  return {
    overview: layout.overview || "",
    beforeYouStart: normaliseTextRows(layout.beforeYouStart),
    beforeYouStartCallout: layout.beforeYouStartCallout || "",
    steps: Array.isArray(layout.steps)
      ? layout.steps
          .map((step) => ({
            title: step?.title || "",
            intro: step?.intro || "",
            checklist: normaliseTextRows(step?.checklist),
            screenshotPlaceholder: {
              enabled: Boolean(step?.screenshotPlaceholder?.enabled),
              image:
                typeof step?.screenshotPlaceholder?.image === "object"
                  ? step.screenshotPlaceholder.image
                  : null,
              alt: step?.screenshotPlaceholder?.alt || "",
              label: step?.screenshotPlaceholder?.label || "",
              caption: step?.screenshotPlaceholder?.caption || "",
              icon: step?.screenshotPlaceholder?.icon || "monitor",
            },
            infoCards: normaliseInfoCards(step?.infoCards),
            callout:
              step?.callout?.body && step?.callout?.type !== "none"
                ? step.callout
                : null,
          }))
          .filter((step) => step.title)
      : [],
    extraSections: Array.isArray(layout.extraSections)
      ? layout.extraSections
          .map((section) => ({
            title: section?.title || "",
            checklist: normaliseTextRows(section?.checklist),
            featureCard:
              section?.featureCard?.enabled && section?.featureCard?.title
                ? section.featureCard
                : null,
          }))
          .filter((section) => section.title)
      : [],
    troubleshooting: normaliseInfoCards(layout.troubleshooting),
    bestPracticeTips: normaliseInfoCards(layout.bestPracticeTips),
    faqs: Array.isArray(layout.faqs)
      ? layout.faqs
          .map((faq) => ({
            question: faq?.question || faq?.title || "",
            answer: faq?.answer || faq?.content || faq?.body || "",
          }))
          .filter((faq) => faq.question && faq.answer)
      : [],
    relatedArticles: normaliseRelatedArticles(layout.relatedArticles),
  };
}

function normaliseCategory(category) {
  const title = category?.title || "Knowledge Base";

  return {
    id: category?.id || slugify(title),
    title,
    description: category?.description || "Browse Genisys support resources.",
    slug: category?.slug || slugify(title),
    iconKey: category?.icon || category?.iconKey || "book-open",
    sortOrder: Number(category?.sortOrder || 0),
  };
}

function normaliseArticle(article) {
  const category =
    typeof article?.category === "object" && article.category
      ? normaliseCategory(article.category)
      : fallbackContentCategories.find((item) => item.title === article?.category) ||
        normaliseCategory({ title: article?.category || "Knowledge Base" });
  const title = article?.title || "Untitled article";
  const slug = article?.slug || slugify(title);
  const readTime = Number(article?.estimatedReadTime || 0);
  const summary =
    article?.summary ||
    article?.excerpt ||
    article?.subtitle ||
    "Read this support article.";
  const excerpt = article?.excerpt || summary;

  return {
    id: article?.id || slug,
    title,
    slug,
    category: category.title,
    categorySlug: category.slug,
    subtitle: article?.subtitle || summary,
    summary,
    excerpt,
    difficulty: article?.difficulty || "",
    appliesTo: normaliseTextRows(article?.appliesTo),
    content: article?.content || null,
    featuredImage:
      typeof article?.featuredImage === "object" ? article.featuredImage : null,
    href: `${articlePathPrefix}/${slug}`,
    iconKey: category.iconKey,
    popularArticle: Boolean(article?.popularArticle),
    readingTime:
      typeof article?.readingTime === "string"
        ? article.readingTime
        : readTime > 0
          ? `${readTime} min`
          : "5 min",
    tags: Array.isArray(article?.tags)
      ? article.tags.map((item) => item?.tag || item).filter(Boolean)
      : [],
    updated: article?.updated || formatPayloadDate(article?.updatedAt || article?.publishedAt),
    guideLayout: normaliseGuideLayout(article?.guideLayout),
    relatedArticles: normaliseRelatedArticles(article?.relatedArticles),
    articleCTA: normaliseArticleCTA(article?.articleCTA),
    seo: article?.seo || null,
  };
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (!size) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function normaliseResource(resource) {
  const title = resource?.title || "Untitled resource";
  const slug = resource?.slug || slugify(title);
  const fileUpload =
    resource?.fileUpload && typeof resource.fileUpload === "object"
      ? resource.fileUpload
      : null;
  const fileUrl = resolvePayloadAssetUrl(fileUpload?.url || "");
  const fileName = fileUpload?.filename || resource?.fileName || "";
  const fileSize = formatFileSize(fileUpload?.filesize || resource?.filesize);

  return {
    id: resource?.id || slug,
    title,
    slug,
    description: resource?.description || "Download this Genisys resource.",
    category: resource?.category || "Downloads",
    resourceType: resource?.resourceType || resource?.type || "PDF Guide",
    fileUpload,
    fileUrl,
    fileName,
    fileSize,
    tags: Array.isArray(resource?.tags)
      ? resource.tags.map((item) => item?.tag || item).filter(Boolean)
      : [],
    featured: Boolean(resource?.featured),
    sortOrder: Number(resource?.sortOrder || 0),
    status: resource?.status || "published",
    publishedAt: resource?.publishedAt || "",
    lastUpdated: formatPayloadDate(resource?.updatedAt || resource?.publishedAt),
  };
}

function buildPayloadUrl(path, params = {}) {
  const baseUrl = payloadApiBaseUrl || window.location.origin;
  const url = new URL(path, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return payloadApiBaseUrl ? url.toString() : `${url.pathname}${url.search}`;
}

function resolvePayloadAssetUrl(path) {
  if (!path || /^https?:\/\//i.test(path)) {
    return path || "";
  }

  return payloadApiBaseUrl ? `${payloadApiBaseUrl}${path}` : path;
}

async function fetchPayloadJSON(path, params) {
  const response = await fetch(buildPayloadUrl(path, params), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Payload request failed: ${response.status}`);
  }

  return response.json();
}

function useKnowledgeData() {
  const [state, setState] = useState({
    articles: fallbackContentArticles.map(normaliseArticle),
    categories: fallbackContentCategories.map(normaliseCategory),
    error: null,
    loading: true,
    resources: fallbackContentResources.map(normaliseResource),
    settings: defaultSettings,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const [
          settings,
          categoriesResponse,
          articlesResponse,
          resourcesResponse,
        ] = await Promise.all([
          fetchPayloadJSON("/api/globals/support-hub-settings"),
          fetchPayloadJSON("/api/knowledge-categories", {
            depth: "0",
            limit: "100",
            sort: "sortOrder,title",
          }),
          fetchPayloadJSON("/api/knowledge-articles", {
            depth: "2",
            limit: "100",
            sort: "-publishedAt,-updatedAt",
            "where[status][equals]": "published",
          }),
          fetchPayloadJSON("/api/resources", {
            depth: "1",
            limit: "100",
            sort: "sortOrder,title",
            "where[status][equals]": "published",
          }),
        ]);

        if (!isMounted) {
          return;
        }

        const categories = Array.isArray(categoriesResponse?.docs)
          ? categoriesResponse.docs.map(normaliseCategory)
          : [];
        const articles = Array.isArray(articlesResponse?.docs)
          ? articlesResponse.docs.map(normaliseArticle)
          : [];
        const resources = Array.isArray(resourcesResponse?.docs)
          ? resourcesResponse.docs.map(normaliseResource)
          : [];

        setState({
          articles: articles.length ? articles : fallbackContentArticles.map(normaliseArticle),
          categories: categories.length
            ? categories
            : fallbackContentCategories.map(normaliseCategory),
          error: null,
          loading: false,
          resources: resources.length
            ? resources
            : fallbackContentResources.map(normaliseResource),
          settings: {
            ...defaultSettings,
            ...settings,
            supportCTA: {
              ...defaultSettings.supportCTA,
              ...(settings?.supportCTA || {}),
            },
          },
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState((current) => ({ ...current, error, loading: false }));
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

function useCurrentPath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return path.replace(/\/$/, "") || "/";
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/92 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[82px] max-w-[1640px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <a href={supportHubPath} className="flex items-center gap-3">
          <img
            src="/brand/genisys-logo-colour.png"
            alt="Genisys"
            className="h-10 w-auto"
          />
          <span className="hidden text-sm font-black uppercase tracking-[0.16em] text-deep-teal sm:block">
            Support Hub
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-black text-slate-600 md:flex">
          <a className="transition hover:text-teal" href={supportHubPath}>
            Home
          </a>
          <a className="transition hover:text-teal" href={`${supportHubPath}/articles`}>
            Articles
          </a>
          <a className="transition hover:text-teal" href={`${supportHubPath}#categories`}>
            Categories
          </a>
        </nav>
        <a
          href={contactSupportUrl}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Contact Support</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-[1640px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] lg:px-10">
        <div>
          <img
            src="/brand/genisys-logo-white-web.png"
            alt="Genisys"
            className="h-10 w-auto"
          />
          <p className="mt-4 text-sm leading-7 text-white/70 xl:whitespace-nowrap">
            The Genisys Support & Knowledge Hub helps clients find practical
            support articles, guides and contact options.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/70">
          <a className="transition hover:text-aqua" href={supportHubPath}>
            Support Hub
          </a>
          <a className="transition hover:text-aqua" href="tel:1300220888">
            1300 220 888
          </a>
        </div>
      </div>
    </footer>
  );
}

function resultMatchesQuery(result, terms) {
  const haystack = result.searchText.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function scoreSearchResult(result, query) {
  const title = result.title.toLowerCase();

  if (title === query) {
    return 100;
  }

  if (title.startsWith(query)) {
    return 80;
  }

  if (title.includes(query)) {
    return 60;
  }

  return result.priority;
}

function buildUniversalSearchResults({ articles, categories, query, settings }) {
  const normalisedQuery = query.trim().toLowerCase();

  if (!normalisedQuery) {
    return [];
  }

  const terms = normalisedQuery.split(/\s+/).filter(Boolean);
  const supportActions = [
    {
      description: "Submit a request to the Genisys team.",
      href: settings.supportCTA?.buttonURL || "#",
      iconKey: "ticket",
      key: "support-ticket",
      keywords: "ticket request help support case",
      priority: 34,
      title: settings.supportCTA?.buttonLabel || "Create a Support Ticket",
      type: "Support",
    },
    {
      description: "Contact the Genisys support team online.",
      href: contactSupportUrl,
      iconKey: "phone",
      key: "contact-support",
      keywords: "contact help support request",
      priority: 32,
      title: "Contact Support",
      type: "Support",
    },
    {
      description: "Start a remote support session.",
      href: remoteSupportUrl,
      iconKey: "monitor",
      key: "remote-support",
      keywords: "remote session screen desktop help support",
      priority: 30,
      title: "Remote Support",
      type: "Support",
    },
    {
      description: "Report a critical incident or outage.",
      href: "tel:1300220888",
      iconKey: "shield-alert",
      key: "critical-incident",
      keywords: "urgent emergency outage incident critical",
      priority: 30,
      title: "Critical Incident",
      type: "Support",
    },
    {
      description: "Open the live Genisys system status page.",
      href: "https://status.genisys.com.au/",
      iconKey: "check-circle",
      key: "system-status",
      keywords: "status uptime outage operational maintenance incident",
      priority: 36,
      title: "System Status",
      type: "Status",
    },
    ...fallbackSystemStatusRows.map((row) => ({
      description: "View this component on the Genisys status page.",
      href: "https://status.genisys.com.au/",
      iconKey: "check-circle",
      key: `status-${row.id}`,
      keywords: "status uptime outage operational maintenance incident",
      priority: 26,
      title: row.name,
      type: "Status",
    })),
  ];

  const searchItems = [
    ...articles.map((article) => ({
      description: `${article.category} · ${article.readingTime}`,
      href: article.href,
      iconKey: article.iconKey,
      key: `article-${article.id}`,
      priority: article.popularArticle ? 44 : 40,
      searchText: [
        article.title,
        article.subtitle,
        article.summary,
        article.excerpt,
        article.difficulty,
        ...(article.appliesTo || []),
        article.category,
        article.readingTime,
        ...(article.tags || []),
      ].join(" "),
      title: article.title,
      type: "Article",
    })),
    ...categories.map((category) => ({
      description: category.description,
      href: `${categoryPathPrefix}/${category.slug}`,
      iconKey: category.iconKey,
      key: `category-${category.slug}`,
      priority: 38,
      searchText: [category.title, category.slug, category.description, "category topic browse"].join(" "),
      title: category.title,
      type: "Topic",
    })),
    {
      description: "Browse every support article in the knowledge base.",
      href: `${supportHubPath}/articles`,
      iconKey: "book-open",
      key: "all-articles",
      priority: 42,
      searchText: "all articles knowledge base browse guides resources",
      title: "All Knowledge Base Articles",
      type: "Article",
    },
    {
      description: "Jump to the popular article list.",
      href: "#articles",
      iconKey: "star",
      key: "popular-articles",
      priority: 35,
      searchText: "popular articles most requested guides",
      title: "Popular Articles",
      type: "Article",
    },
    ...supportActions.map((item) => ({
      ...item,
      searchText: [item.title, item.description, item.type, item.keywords].join(" "),
    })),
  ];

  return searchItems
    .filter((result) => resultMatchesQuery(result, terms))
    .map((result) => ({
      ...result,
      score: scoreSearchResult(result, normalisedQuery),
    }))
    .sort((a, b) => b.score - a.score || b.priority - a.priority)
    .slice(0, 8);
}

function Hero({ articles, categories, settings, query, setQuery }) {
  const universalResults = useMemo(
    () => buildUniversalSearchResults({ articles, categories, query, settings }),
    [articles, categories, query, settings]
  );
  const placeholder = settings.searchPlaceholder?.toLowerCase().includes("genisys ai")
    || settings.searchPlaceholder?.toLowerCase().includes("articles or guides")
    ? defaultSettings.searchPlaceholder
    : settings.searchPlaceholder || defaultSettings.searchPlaceholder;

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="digital-wave" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-vignette" />
      </div>
      <div className="relative mx-auto grid min-h-[540px] max-w-[1640px] gap-10 px-4 pb-32 pt-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-10 lg:pb-36 lg:pt-20 xl:min-h-[600px]">
        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-aqua shadow-lg shadow-teal/10 backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Genisys Support & Knowledge Hub
          </p>
          <h1 className="text-4xl font-black leading-[1.02] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-7 max-w-[680px] text-base leading-8 text-white/90 sm:text-lg">
            {settings.heroSubtitle}
          </p>
          <form
            className="relative mt-10 max-w-[820px]"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              if (universalResults[0]?.href) {
                window.location.href = universalResults[0].href;
                return;
              }
              document.getElementById("articles")?.scrollIntoView({ block: "start" });
            }}
          >
            <label htmlFor="hub-search" className="sr-only">
              Search the support hub
            </label>
            <div className="group/search rounded-lg border border-white/70 bg-white/95 p-2.5 shadow-[0_26px_70px_rgba(0,18,30,0.32),inset_0_0_0_1px_rgba(255,255,255,0.68)] backdrop-blur transition duration-200 hover:shadow-glow focus-within:border-aqua focus-within:shadow-glow">
              <div className="flex min-w-0 flex-1 items-center gap-4 px-4">
                <Search className="h-6 w-6 shrink-0 text-deep-teal" aria-hidden="true" />
                <input
                  id="hub-search"
                  type="search"
                  value={query}
                  placeholder={placeholder}
                  className="h-14 min-w-0 flex-1 border-0 bg-transparent text-base font-medium text-navy placeholder:text-slate-500 focus:outline-none"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            {query.trim() ? (
              <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-lg border border-white/75 bg-white text-navy shadow-[0_28px_90px_rgba(0,18,30,0.36)] ring-1 ring-slate-200/70">
                {universalResults.length ? (
                  <ul className="max-h-[430px] divide-y divide-slate-200/70 overflow-y-auto p-2">
                    {universalResults.map((result) => {
                      const ResultIcon = getIcon(result.iconKey);

                      return (
                        <li key={result.key}>
                          <a
                            href={result.href}
                            className="group flex items-center gap-4 rounded-md px-3 py-3 transition hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                          >
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-aqua/40 group-hover:text-teal">
                              <ResultIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="min-w-0 text-sm font-black leading-5 text-navy">
                                  {result.title}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black uppercase tracking-normal text-slate-500">
                                  {result.type}
                                </span>
                              </span>
                              <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                                {result.description}
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-navy transition group-hover:translate-x-1 group-hover:text-teal" aria-hidden="true" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-5 py-4 text-sm font-semibold text-slate-600">
                    No matching articles, topics, support actions or status services.
                  </div>
                )}
              </div>
            ) : null}
          </form>
        </div>
        <EmergencySupportCard />
      </div>
    </section>
  );
}

function EmergencySupportCard() {
  return (
    <aside className="self-start rounded-lg border border-aqua/30 bg-white/[0.13] p-7 text-white shadow-[0_30px_90px_rgba(0,18,30,0.42),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-2xl ring-1 ring-white/10 lg:mt-16">
      <div className="flex gap-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-[0_18px_36px_rgba(239,68,68,0.34)] ring-4 ring-red-400/20">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Emergency Support</h2>
          <p className="mt-3 text-sm leading-7 text-white/90">
            For critical issues or major outages requiring immediate assistance.
          </p>
        </div>
      </div>
      <a
        href="tel:1300220888"
        className="mt-8 flex items-center gap-4 rounded-md text-3xl font-black text-[#9ee8e4] drop-shadow-[0_0_18px_rgba(136,209,207,0.34)] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
      >
        <Phone className="h-7 w-7" aria-hidden="true" />
        1300 220 888
      </a>
      <a
        href="#articles"
        className="mt-7 inline-flex items-center gap-2 rounded-md text-sm font-black text-aqua transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
      >
        Browse support articles
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  );
}

function QuickAccessTiles({ categories }) {
  return (
    <section
      aria-labelledby="quick-access-title"
      className="mx-auto -mt-20 max-w-[1640px] px-4 sm:px-6 lg:px-10"
    >
      <h2 id="quick-access-title" className="sr-only">
        Quick access
      </h2>
      <div className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_26px_70px_rgba(0,36,59,0.14),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => {
            const Icon = getIcon(category.iconKey);

            return (
              <a
                key={category.slug}
                href={`${categoryPathPrefix}/${category.slug}`}
                className="group flex min-h-[126px] items-center gap-5 rounded-lg border border-slate-200/70 bg-white p-5 shadow-tile transition duration-200 hover:-translate-y-1.5 hover:border-teal/80 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-teal group-hover:text-white">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-black leading-5 text-navy">
                  {category.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-deep-teal transition group-hover:translate-x-1 group-hover:text-teal" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CardShell({ children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-slate-200/65 bg-white p-6 shadow-soft ring-1 ring-white/70 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-aqua/25 text-deep-teal">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-black text-navy">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function ArticleListCard({ articles, icon: Icon, title, showDate = false }) {
  return (
    <CardShell>
      <SectionHeader icon={Icon} title={title} />
      <ul className="divide-y divide-slate-200/70">
        {articles.slice(0, 5).map((article) => {
          const ArticleIcon = getIcon(article.iconKey);

          return (
            <li key={article.id}>
              <a
                href={article.href}
                className="group flex items-center gap-4 rounded-md px-2 py-4 transition hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-aqua/40 group-hover:text-teal">
                  <ArticleIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black leading-5 text-navy">
                    {article.title}
                  </span>
                  <span className="mt-1.5 block text-xs font-semibold text-slate-400">
                    {article.category}
                    {showDate ? ` · ${article.updated}` : ""}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-navy transition group-hover:translate-x-1 group-hover:text-teal" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href={`${supportHubPath}/articles`}
        className="mt-7 inline-flex items-center gap-2 rounded-md text-sm font-black text-deep-teal transition hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
      >
        View all articles
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </CardShell>
  );
}

const fallbackSystemStatusRows = [
  { id: "genisys-support-web-chat", name: "Genisys Support Web Chat", status: "unknown" },
  { id: "genisys-phone-support", name: "Genisys Phone Support", status: "unknown" },
  {
    id: "network-connectivity-australia",
    name: "Network Connectivity (Australia)",
    status: "unknown",
  },
  { id: "telephony", name: "Telephony", status: "unknown" },
  { id: "gosip-voip-services", name: "GoSIP VoIP Services", status: "unknown" },
  { id: "genisys-teams-calling", name: "Genisys Teams Calling", status: "unknown" },
];

const statusPageSummaryUrl = "https://status.genisys.com.au/api/v2/summary.json";
const statusPageUrl = "https://status.genisys.com.au/";
const preferredStatusComponentNames = [
  "Genisys Support Web Chat",
  "Genisys Phone Support",
  "Network Connectivity (Australia)",
  "Telephony",
  "GoSIP VoIP Services",
  "Genisys Teams Calling",
  "Hosted Infrastructure Services",
  "Backup as a Service (BaaS)",
  "Disaster Recovery as a Service (DRaaS)",
  "Desktop & Applications (DAaaS)",
];

const systemStatusStyleByStatus = {
  operational: {
    dot: "bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.14),0_0_18px_rgba(52,211,153,0.5)]",
    icon: CheckCircle2,
    label: "Operational",
    summary: "All systems operational",
    text: "text-emerald-700",
    panel: "border-aqua/40 bg-gradient-to-r from-aqua/40 to-teal/10",
    panelIcon: "text-teal",
  },
  degraded_performance: {
    dot: "bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.16),0_0_18px_rgba(251,191,36,0.45)]",
    icon: AlertTriangle,
    label: "Degraded",
    summary: "Some services degraded",
    text: "text-amber-700",
    panel: "border-amber-200 bg-amber-50",
    panelIcon: "text-amber-600",
  },
  partial_outage: {
    dot: "bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.16),0_0_18px_rgba(249,115,22,0.45)]",
    icon: AlertTriangle,
    label: "Partial outage",
    summary: "Partial service outage",
    text: "text-orange-700",
    panel: "border-orange-200 bg-orange-50",
    panelIcon: "text-orange-600",
  },
  major_outage: {
    dot: "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.16),0_0_18px_rgba(239,68,68,0.45)]",
    icon: AlertTriangle,
    label: "Major outage",
    summary: "Major service outage",
    text: "text-red-700",
    panel: "border-red-200 bg-red-50",
    panelIcon: "text-red-600",
  },
  under_maintenance: {
    dot: "bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.16),0_0_18px_rgba(56,189,248,0.45)]",
    icon: Clock,
    label: "Maintenance",
    summary: "Maintenance in progress",
    text: "text-sky-700",
    panel: "border-sky-200 bg-sky-50",
    panelIcon: "text-sky-600",
  },
  unknown: {
    dot: "bg-slate-300 shadow-[0_0_0_4px_rgba(148,163,184,0.14)]",
    icon: Info,
    label: "Checking",
    summary: "Checking system status",
    text: "text-slate-500",
    panel: "border-slate-200 bg-slate-50",
    panelIcon: "text-slate-500",
  },
};

function getSystemStatusStyle(status) {
  return systemStatusStyleByStatus[status] || systemStatusStyleByStatus.unknown;
}

function normaliseOverallStatus(indicator, rows) {
  if (indicator === "none") {
    return "operational";
  }

  if (indicator === "minor") {
    return "degraded_performance";
  }

  if (indicator === "major") {
    return "partial_outage";
  }

  if (indicator === "critical") {
    return "major_outage";
  }

  if (indicator === "maintenance") {
    return "under_maintenance";
  }

  return rows.some((row) => row.status !== "unknown")
    ? "operational"
    : "unknown";
}

function normaliseSystemStatusPayload(payload) {
  const rows = Array.isArray(payload?.rows)
    ? payload.rows
        .map((row) => ({
          id: row?.id || slugify(row?.name),
          name: row?.name || "Status component",
          status: row?.status || "unknown",
        }))
        .filter((row) => row.name)
    : [];

  return {
    incidents: Number(payload?.incidents || 0),
    pageURL: payload?.pageURL || "https://status.genisys.com.au/",
    rows: rows.length ? rows : fallbackSystemStatusRows,
    scheduledMaintenances: Number(payload?.scheduledMaintenances || 0),
    source: payload?.source || "fallback",
    status: {
      description: payload?.status?.description || "",
      indicator: payload?.status?.indicator || "unknown",
    },
    updatedAt: payload?.updatedAt || "",
  };
}

function normaliseStatusPageComponent(component) {
  return {
    id: component?.id || slugify(component?.name),
    name: component?.name || "Status component",
    status: component?.status || "unknown",
  };
}

function chooseStatusPageComponents(components = []) {
  const selected = preferredStatusComponentNames
    .map((name) => components.find((component) => component?.name === name))
    .filter(Boolean);

  if (selected.length >= 6) {
    return selected.slice(0, 6).map(normaliseStatusPageComponent);
  }

  const selectedIds = new Set(selected.map((component) => component.id));
  const remaining = components
    .filter((component) => component?.name && !selectedIds.has(component.id))
    .sort((a, b) => Number(a?.position || 0) - Number(b?.position || 0));

  return [...selected, ...remaining]
    .slice(0, 6)
    .map(normaliseStatusPageComponent);
}

function normaliseStatusPageSummary(data) {
  const rows = chooseStatusPageComponents(
    Array.isArray(data?.components) ? data.components : [],
  );

  return {
    incidents: Array.isArray(data?.incidents) ? data.incidents.length : 0,
    pageURL: data?.page?.url || statusPageUrl,
    rows: rows.length ? rows : fallbackSystemStatusRows,
    scheduledMaintenances: Array.isArray(data?.scheduled_maintenances)
      ? data.scheduled_maintenances.length
      : 0,
    source: "live",
    status: {
      description: data?.status?.description || "Status available",
      indicator: data?.status?.indicator || "unknown",
    },
    updatedAt: data?.page?.updated_at || "",
  };
}

async function fetchStatusPageSummary() {
  const response = await fetch(statusPageSummaryUrl, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Status feed returned ${response.status}`);
  }

  return normaliseStatusPageSummary(await response.json());
}

async function fetchSystemStatus() {
  try {
    return await fetchStatusPageSummary();
  } catch (directError) {
    try {
      return normaliseSystemStatusPayload(await fetchPayloadJSON("/api/system-status"));
    } catch {
      throw directError;
    }
  }
}

function useSystemStatus() {
  const [state, setState] = useState(() => ({
    ...normaliseSystemStatusPayload(null),
    error: null,
    loading: true,
  }));

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const data = await fetchSystemStatus();

        if (!isMounted) {
          return;
        }

        setState({
          ...data,
          error: null,
          loading: false,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          error,
          loading: false,
        }));
      }
    }

    loadStatus();
    const refresh = window.setInterval(loadStatus, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(refresh);
    };
  }, []);

  return state;
}

function SystemStatus() {
  const status = useSystemStatus();
  const rows = status.rows.slice(0, 6);
  const overallStatus = normaliseOverallStatus(status.status.indicator, rows);
  const overallStyle = getSystemStatusStyle(overallStatus);
  const SummaryIcon = overallStyle.icon;
  const updatedAt = formatStatusUpdatedAt(status.updatedAt);
  const summaryDetail = status.loading
    ? "Refreshing from Genisys Status"
    : status.error || status.source !== "live"
      ? "Live feed unavailable"
      : status.incidents > 0
        ? `${status.incidents} active incident${status.incidents === 1 ? "" : "s"}`
        : status.scheduledMaintenances > 0
          ? `${status.scheduledMaintenances} active maintenance window${
              status.scheduledMaintenances === 1 ? "" : "s"
            }`
          : updatedAt
            ? `Updated ${updatedAt}`
            : "Live from Genisys Status";

  return (
    <CardShell>
      <SectionHeader
        icon={overallStyle.icon}
        title="System Status"
        action={
          <a
            href={status.pageURL}
            className="inline-flex items-center gap-1 text-xs font-black text-deep-teal transition hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        }
      />
      <ul className="divide-y divide-slate-200/70">
        {rows.map((row) => {
          const rowStyle = getSystemStatusStyle(row.status);

          return (
          <li
            key={row.id}
            className="grid grid-cols-[minmax(0,1fr)_118px] items-center gap-4 py-4"
          >
            <span className="min-w-0 text-sm font-black leading-5 text-navy">
              {row.name}
            </span>
            <span
              className={`inline-flex items-center justify-self-end gap-2 text-xs font-black ${rowStyle.text}`}
            >
              <span className={`h-3 w-3 rounded-full ${rowStyle.dot}`} />
              {rowStyle.label}
            </span>
          </li>
          );
        })}
      </ul>
      <div
        className={`mt-7 flex items-center gap-4 rounded-lg border p-5 shadow-inner ${overallStyle.panel}`}
      >
        <SummaryIcon
          className={`h-7 w-7 shrink-0 ${overallStyle.panelIcon}`}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-black text-navy">
            {status.status.description || overallStyle.summary}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-600">
            {summaryDetail}
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function HelpCard({ settings }) {
  const actions = [
    { label: settings.buttonLabel, icon: Ticket, href: settings.buttonURL },
    { label: "Contact Support", icon: Phone, href: contactSupportUrl },
    { label: "Remote Support", icon: Monitor, href: remoteSupportUrl },
    { label: "Critical Incident", icon: AlertTriangle, href: "#" },
  ];

  return (
    <CardShell className="h-fit">
      <h2 className="text-xl font-black text-navy">{settings.heading}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{settings.body}</p>
      <ul className="mt-6 divide-y divide-slate-200/70">
        {actions.map(({ label, icon: Icon, href }) => (
          <li key={label}>
            <a
              href={href}
              className="group flex items-center gap-4 rounded-md px-2 py-4 transition hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-aqua/40 group-hover:text-teal">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-navy">{label}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-navy transition group-hover:translate-x-1 group-hover:text-teal" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

function CategoriesGrid({ categories }) {
  return (
    <section id="categories" aria-labelledby="category-title" className="mt-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal">
            Knowledge Categories
          </p>
          <h2 id="category-title" className="mt-2 text-2xl font-black text-navy">
            Browse support by topic
          </h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = getIcon(category.iconKey);

          return (
            <a
              key={category.slug}
              href={`${categoryPathPrefix}/${category.slug}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200/65 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal/70 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-aqua to-transparent opacity-75 transition group-hover:opacity-100" />
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-teal group-hover:text-white">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-black text-navy">{category.title}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600">
                {category.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-deep-teal transition group-hover:text-teal">
                Browse articles
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const Icon = getIcon(article.iconKey);

  return (
    <a
      href={article.href}
      className="group flex min-h-[280px] flex-col rounded-lg border border-slate-200/70 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal/70 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-aqua/20 px-3 py-1 text-xs font-black text-deep-teal">
          {article.category}
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-aqua/25 text-deep-teal transition group-hover:bg-teal group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-6 text-navy">
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
        {article.excerpt}
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-teal" aria-hidden="true" />
          {article.readingTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-teal" aria-hidden="true" />
          {article.updated}
        </span>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-deep-teal transition group-hover:text-teal">
        Read Article
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </a>
  );
}

function filterArticles(articles, query, categorySlug = "") {
  const normalisedQuery = query.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory = categorySlug ? article.categorySlug === categorySlug : true;
    const haystack = [
      article.title,
      article.excerpt,
      article.category,
      ...(article.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = normalisedQuery ? haystack.includes(normalisedQuery) : true;

    return matchesCategory && matchesQuery;
  });
}

function SupportHubHome({ articles, categories, loading, error, settings }) {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(params.get("category") || "");
  const popularArticles = articles.filter((article) => article.popularArticle);
  const visibleArticles = filterArticles(articles, query, activeCategory);

  return (
    <>
      <Hero
        articles={articles}
        categories={categories}
        settings={settings}
        query={query}
        setQuery={setQuery}
      />
      <QuickAccessTiles categories={categories} />
      <main
        id="articles"
        className="mx-auto max-w-[1640px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
      >
        {(loading || error) && (
          <div className="mb-6 rounded-lg border border-aqua/35 bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow-soft">
            {loading
              ? "Loading support hub content from Payload..."
              : "Using fallback support content while Payload is unavailable."}
          </div>
        )}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ArticleListCard articles={popularArticles} icon={Star} title="Popular Articles" />
            <ArticleListCard
              articles={articles}
              icon={CalendarDays}
              showDate
              title="Recently Updated"
            />
            <SystemStatus />
          </div>
          <HelpCard settings={settings.supportCTA} />
        </div>

        <section className="mt-8 rounded-lg border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="sr-only">Filter support articles</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`max-w-full rounded-full border px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${
                activeCategory === ""
                  ? "border-teal bg-teal text-white shadow-lg shadow-teal/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal hover:bg-[#f2fbfb] hover:text-deep-teal"
              }`}
              onClick={() => setActiveCategory("")}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={`max-w-full rounded-full border px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${
                  activeCategory === category.slug
                    ? "border-teal bg-teal text-white shadow-lg shadow-teal/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-teal hover:bg-[#f2fbfb] hover:text-deep-teal"
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="article-grid-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="article-grid-title" className="text-2xl font-black text-navy">
                Knowledge Base Articles
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {visibleArticles.length} article
                {visibleArticles.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <CategoriesGrid categories={categories} />
      </main>
    </>
  );
}

function ListingPage({ articles, categories, categorySlug = "" }) {
  const [query, setQuery] = useState("");
  const category = categories.find((item) => item.slug === categorySlug);
  const visibleArticles = filterArticles(articles, query, categorySlug);

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_16%,rgba(0,151,165,0.38),transparent_34%),radial-gradient(ellipse_at_18%_90%,rgba(136,209,207,0.18),transparent_30%),linear-gradient(115deg,#001827_0%,#00243B_48%,#005E82_100%)]" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Breadcrumb items={["Home", category ? "Categories" : "Knowledge Base"]} />
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-aqua/35 bg-white/10 px-3 py-1 text-sm font-black text-aqua shadow-lg shadow-teal/10 backdrop-blur">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {category ? category.title : "Knowledge Base"}
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            {category ? category.title : "Browse Knowledge Base Articles"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
            {category
              ? category.description
              : "Explore practical guides, security advice and troubleshooting articles for Genisys-managed services."}
          </p>
          <label htmlFor="article-search" className="sr-only">
            Search knowledge base articles
          </label>
          <div className="mt-8 flex max-w-4xl items-center gap-4 rounded-lg border border-white/70 bg-white/95 p-3 shadow-[0_26px_70px_rgba(0,18,30,0.28),inset_0_0_0_1px_rgba(255,255,255,0.68)] backdrop-blur transition hover:shadow-glow focus-within:border-aqua focus-within:shadow-glow">
            <Search className="h-6 w-6 shrink-0 text-deep-teal" aria-hidden="true" />
            <input
              id="article-search"
              type="search"
              value={query}
              placeholder="Search articles, guides and resources..."
              className="h-12 min-w-0 flex-1 border-0 bg-transparent text-base font-medium text-navy placeholder:text-slate-500 focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {!visibleArticles.length && (
          <CardShell className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-teal" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black text-navy">
              No articles found
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
              Try a different search term or browse all categories.
            </p>
          </CardShell>
        )}
      </main>
    </>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/75">
      <a
        href={supportHubPath}
        className="rounded-md transition hover:text-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
      >
        Support Hub
      </a>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2 whitespace-nowrap">
          <ChevronRight className="h-4 w-4 text-aqua/70" aria-hidden="true" />
          <span>{item}</span>
        </span>
      ))}
    </nav>
  );
}

function ResourceFilterButton({ active, children, onClick, label }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua ${
        active
          ? "border-aqua bg-aqua text-navy shadow-lg shadow-aqua/20"
          : "border-white/25 bg-white/10 text-white hover:border-aqua/70 hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function ResourceCategoryCard({ category }) {
  const Icon = getIcon(category.iconKey);

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-aqua/70 hover:shadow-panel">
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-aqua/25 text-deep-teal">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-black leading-tight text-navy">
        {category.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {category.description}
      </p>
      <ul className="mt-5 space-y-2 text-sm font-bold text-slate-700">
        {category.exampleResources.map((resource) => (
          <li key={resource} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
            <span>{resource}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ResourceBadge({ children, tone = "default" }) {
  const toneClass =
    tone === "dark"
      ? "border-aqua/30 bg-aqua/15 text-aqua"
      : "border-teal/15 bg-[#eefafa] text-deep-teal";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${toneClass}`}>
      {children}
    </span>
  );
}

function FeaturedResourceCard({ resource }) {
  const hasFile = Boolean(resource.fileUrl);

  return (
    <article className="group flex h-full flex-col rounded-lg border border-white/70 bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-navy text-aqua">
          <Download className="h-6 w-6" aria-hidden="true" />
        </span>
        <ResourceBadge>{resource.resourceType}</ResourceBadge>
      </div>
      <h3 className="mt-6 text-2xl font-black leading-tight text-navy">
        {resource.title}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
        {resource.description}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <ResourceBadge>{resource.category}</ResourceBadge>
        {resource.fileSize && (
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500">
            <Download className="h-4 w-4" aria-hidden="true" />
            {resource.fileSize}
          </span>
        )}
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        {hasFile ? (
          <>
            <a
              href={resource.fileUrl}
              download
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-4 py-3 text-sm font-black text-white shadow-lg shadow-teal/20 transition group-hover:-translate-y-0.5 group-hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              Download PDF
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-deep-teal/20 px-4 py-3 text-sm font-black text-deep-teal transition hover:border-teal hover:bg-[#eefafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              View PDF
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
            PDF pending
          </span>
        )}
      </div>
    </article>
  );
}

function ResourceGridCard({ resource }) {
  const hasFile = Boolean(resource.fileUrl);

  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-aqua/70 hover:shadow-panel">
      <div className="flex flex-wrap items-center gap-2">
        <ResourceBadge>{resource.category}</ResourceBadge>
        <ResourceBadge>{resource.resourceType}</ResourceBadge>
      </div>
      <h3 className="mt-5 text-xl font-black leading-tight text-navy">
        {resource.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
        {resource.description}
      </p>
      <dl className="mt-5 grid gap-3 text-xs font-bold text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg bg-[#f3f8f9] px-3 py-2">
          <Download className="h-4 w-4 text-teal" aria-hidden="true" />
          <div>
            <dt className="sr-only">File type</dt>
            <dd>{resource.resourceType}</dd>
          </div>
        </div>
        {(resource.fileSize || resource.lastUpdated) && (
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f8f9] px-3 py-2">
            {resource.fileSize ? (
              <Download className="h-4 w-4 text-teal" aria-hidden="true" />
            ) : (
              <CalendarDays className="h-4 w-4 text-teal" aria-hidden="true" />
            )}
            <div>
              <dt className="sr-only">
                {resource.fileSize ? "File size" : "Last updated"}
              </dt>
              <dd>{resource.fileSize || resource.lastUpdated}</dd>
            </div>
          </div>
        )}
      </dl>
      {hasFile ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <a
            href={resource.fileUrl}
            download
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            Download
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-deep-teal/20 px-4 py-2.5 text-sm font-black text-deep-teal transition hover:border-teal hover:bg-[#eefafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            View PDF
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          PDF pending. Upload a file in Payload before publishing this resource.
        </p>
      )}
    </article>
  );
}

function resourceMatchesSearch(resource, searchQuery) {
  const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const haystack = [
    resource.title,
    resource.description,
    resource.category,
    resource.resourceType,
    ...(resource.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

function ResourceHubTemplate({ resources }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const resourceItems = useMemo(
    () =>
      resources?.length
        ? resources
        : fallbackContentResources.map(normaliseResource),
    [resources],
  );

  const featuredResources = useMemo(
    () => resourceItems.filter((resource) => resource.featured),
    [resourceItems],
  );

  const filteredResources = useMemo(() => {
    return resourceItems.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" || resource.category === activeCategory;

      return matchesCategory && resourceMatchesSearch(resource, searchQuery);
    });
  }, [activeCategory, resourceItems, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="digital-wave" aria-hidden="true">
          <div className="hero-glow" />
          <div className="hero-vignette" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Breadcrumb items={["Downloads & Resources"]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-end">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-aqua/35 bg-white/10 px-3 py-1 text-sm font-black text-aqua shadow-lg shadow-teal/10 backdrop-blur">
                <Download className="h-4 w-4" aria-hidden="true" />
                Resource Library
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                Downloads & Resources
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
                Access uploaded PDF guides, checklists and documentation to
                support your technology, security and business operations.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
                Find practical downloadable resources for email security,
                awareness training, endpoint protection and compliance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#resource-library"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-aqua to-teal px-5 py-3 text-sm font-black text-navy shadow-lg shadow-aqua/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
                >
                  Browse Resources
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={contactSupportUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-aqua/70 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Contact Support
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-lg shadow-black/15 backdrop-blur">
              <label
                htmlFor="resource-search"
                className="text-sm font-black text-aqua"
              >
                Search resources
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/20 bg-white px-4 py-3 text-navy shadow-inner">
                <Search className="h-5 w-5 shrink-0 text-deep-teal" aria-hidden="true" />
                <input
                  id="resource-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search PDFs, categories or tags"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-navy placeholder:text-slate-400 focus:outline-none"
                  type="search"
                />
              </div>
              <p id="resource-search-help" className="mt-3 text-xs font-semibold text-white/70">
                Search by title, description, category or tag.
              </p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Resource category filters">
                {resourceCategoryFilters.map((category) => (
                  <ResourceFilterButton
                    key={category}
                    active={activeCategory === category}
                    label={`Filter by ${category}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </ResourceFilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-black uppercase tracking-wide text-teal">
                Resource categories
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-navy">
                Find the right starting point
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Browse downloadable PDF resources by security domain, platform or
              compliance focus.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {resourceCategoryCards.map((category) => (
              <ResourceCategoryCard key={category.title} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-[#eaf6f7] py-12 sm:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-black text-deep-teal shadow-sm">
                  <Star className="h-4 w-4 text-teal" aria-hidden="true" />
                  Featured PDFs
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-normal text-navy">
                  Download-ready resources for busy teams
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Start with these published PDF resources from the Genisys
                support library.
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {featuredResources.map((resource) => (
                <FeaturedResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="resource-library"
          className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-sm font-black uppercase tracking-wide text-teal">
                Resource library
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-navy">
                PDF guides and downloadable resources
              </h2>
            </div>
            <p className="text-sm font-black text-slate-500">
              {filteredResources.length} resource
              {filteredResources.length === 1 ? "" : "s"} found
            </p>
          </div>

          {filteredResources.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((resource) => (
                <ResourceGridCard key={resource.slug} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-teal/35 bg-white px-6 py-14 text-center shadow-soft">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-aqua/25 text-deep-teal">
                <Search className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-black text-navy">
                No resources found.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Try adjusting your search or selecting a different category.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
              >
                Clear Filters
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg bg-navy px-6 py-10 text-white shadow-panel sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_22%,rgba(0,151,165,0.32),transparent_34%),linear-gradient(115deg,#001827_0%,#00243B_58%,#005E82_100%)]" aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-normal">
                  Need help finding the right resource?
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78">
                  If you cannot find the guide, checklist or support information
                  you need, the Genisys team can help point you in the right
                  direction.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contactSupportUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-aqua px-5 py-3 text-sm font-black text-navy shadow-lg shadow-aqua/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
                >
                  Contact Support
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={contactSupportUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-aqua/70 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-aqua"
                >
                  Book an Expert
                  <Users className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ArticlePage({ article, categories }) {
  if (!article) {
    return <NotFound />;
  }

  const Icon = getIcon(article.iconKey);
  const tocItems = buildArticleToc(article);
  const appliesTo = article.appliesTo.length
    ? article.appliesTo.join(", ")
    : article.tags.length
      ? article.tags.join(", ")
      : article.category;
  const difficulty = article.difficulty
    ? article.difficulty.charAt(0).toUpperCase() + article.difficulty.slice(1)
    : "";

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(0,151,165,0.34),transparent_34%),radial-gradient(ellipse_at_22%_100%,rgba(136,209,207,0.16),transparent_32%),linear-gradient(115deg,#001827_0%,#00243B_48%,#005E82_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(136,209,207,0.42)_1px,transparent_1.4px)] [background-size:22px_22px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Breadcrumb items={[article.category, article.title]} />
          <div className="mt-8 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-aqua/35 bg-white/10 px-3 py-1 text-sm font-black text-aqua shadow-lg shadow-teal/10 backdrop-blur">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {article.category}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
              {article.subtitle || article.excerpt}
            </p>
            <dl
              className={`mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-2 ${
                difficulty ? "xl:grid-cols-4" : "xl:grid-cols-3"
              }`}
            >
              <ArticleMeta icon={CalendarDays} label="Updated" value={article.updated} />
              <ArticleMeta icon={Clock} label="Estimated time" value={article.readingTime} />
              {difficulty && (
                <ArticleMeta icon={CheckCircle2} label="Difficulty" value={difficulty} />
              )}
              <ArticleMeta
                icon={ListChecks}
                label="Applies to"
                value={appliesTo}
              />
            </dl>
          </div>
        </div>
      </section>
      <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-10">
        <ArticleLeftSidebar activeCategory={article.category} categories={categories} />
        <ArticleContent article={article} tocItems={tocItems} />
        <ArticleRightSidebar tocItems={tocItems} />
      </main>
    </>
  );
}

function ArticleMeta({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
      <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-aqua">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-white">{value}</dd>
    </div>
  );
}

function ArticleLeftSidebar({ activeCategory, categories }) {
  return (
    <aside className="lg:col-span-3">
      <div className="space-y-5 lg:sticky lg:top-32">
        <section className="rounded-lg border border-slate-200/70 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Knowledge Base</h2>
          <nav className="mt-4 space-y-1" aria-label="Knowledge Base categories">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`${categoryPathPrefix}/${category.slug}`}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${
                  category.title === activeCategory
                    ? "bg-aqua/25 text-deep-teal"
                    : "text-slate-600 hover:bg-[#f2fbfb] hover:text-deep-teal"
                }`}
              >
                {category.title}
                {category.title === activeCategory && (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
              </a>
            ))}
          </nav>
        </section>
        <section className="rounded-lg border border-aqua/35 bg-gradient-to-br from-white to-aqua/20 p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Need help?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Our support team can help if you need more detail on this article.
          </p>
          <a
            href={contactSupportUrl}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </div>
    </aside>
  );
}

function ArticleRightSidebar({ tocItems }) {
  return (
    <aside className="lg:col-span-3">
      <div className="space-y-5 lg:sticky lg:top-32">
        {tocItems.length > 0 && (
          <section className="hidden rounded-lg border border-slate-200/70 bg-white p-5 shadow-soft lg:block">
            <h2 className="text-lg font-black text-navy">On this page</h2>
            <nav className="mt-4 space-y-1" aria-label="On this page">
              {tocItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-[#f2fbfb] hover:text-deep-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </section>
        )}
        <section className="rounded-lg border border-slate-200/70 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Was this article helpful?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-deep-teal transition hover:border-teal hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              Yes
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-deep-teal transition hover:border-teal hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
              No
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}

function buildArticleToc(article) {
  const layout = article.guideLayout;

  if (!layout) {
    return buildRichTextToc(article.content);
  }

  return [
    layout.overview ? { label: "Overview", href: "#overview" } : null,
    layout.beforeYouStart?.length
      ? { label: "Before You Start", href: "#before-you-start" }
      : null,
    ...(layout.steps || []).map((step) => ({
      label: step.title.replace(/^Step\s+\d+:\s*/i, ""),
      href: `#${slugify(step.title)}`,
    })),
    ...(layout.extraSections || []).map((section) => ({
      label: section.title,
      href: `#${slugify(section.title)}`,
    })),
    layout.troubleshooting?.length
      ? { label: "Troubleshooting", href: "#troubleshooting" }
      : null,
    layout.bestPracticeTips?.length
      ? { label: "Best Practice Tips", href: "#best-practices" }
      : null,
    layout.faqs?.length
      ? { label: "Frequently Asked Questions", href: "#frequently-asked-questions" }
      : null,
  ].filter(Boolean);
}

function buildRichTextToc(content) {
  const children = content?.root?.children;

  if (!Array.isArray(children)) {
    return [];
  }

  return children
    .filter((node) => node?.type === "heading")
    .map((node) => {
      const label = getLexicalPlainText(node);

      return label
        ? {
            label,
            href: `#${slugify(label)}`,
          }
        : null;
    })
    .filter(Boolean);
}

function ArticleContent({ article, tocItems }) {
  if (article.guideLayout) {
    return <StructuredArticleContent article={article} tocItems={tocItems} />;
  }

  return (
    <article className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-panel ring-1 ring-white/70 sm:p-8 lg:col-span-6 lg:p-10">
      {tocItems.length > 0 && (
        <details className="mb-8 rounded-lg border border-aqua/35 bg-aqua/10 p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-black text-deep-teal">
            On this page
          </summary>
          <div className="mt-3">
            {tocItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-md px-2 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-deep-teal"
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      )}
      <ArticleFeaturedImage article={article} />
      <div className="mb-8 rounded-lg border border-aqua/35 bg-aqua/10 p-5">
        <p className="text-base font-semibold leading-8 text-slate-700">
          {article.excerpt}
        </p>
      </div>
      <div className="payload-rich-text text-base leading-8 text-slate-700">
        {renderLexicalContent(article.content)}
      </div>
      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-aqua/40 bg-aqua/10 px-3 py-1.5 text-xs font-black text-deep-teal"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <ArticleCtaBlock cta={article.articleCTA} />
      <RelatedArticleLinks articles={article.relatedArticles} />
    </article>
  );
}

function ArticleFeaturedImage({ article }) {
  if (!article.featuredImage?.url) {
    return null;
  }

  return (
    <figure className="mb-8 overflow-hidden rounded-lg border border-slate-200/70 bg-slate-50 shadow-soft">
      <img
        src={article.featuredImage.url}
        alt={article.featuredImage.alt || article.title}
        className="aspect-[16/9] w-full object-cover"
      />
    </figure>
  );
}

function ArticleCtaBlock({ cta }) {
  if (!cta) {
    return null;
  }

  return (
    <section className="mt-8 rounded-lg border border-aqua/40 bg-gradient-to-br from-[#f2fbfb] to-white p-6 shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-deep-teal">
            Security Assessment
          </p>
          <h2 className="mt-2 text-2xl font-black text-navy">{cta.headline}</h2>
          {cta.description && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
              {cta.description}
            </p>
          )}
        </div>
        <ShieldCheck className="hidden h-10 w-10 shrink-0 text-teal sm:block" aria-hidden="true" />
      </div>
      {(cta.primaryButton || cta.secondaryButton) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {cta.primaryButton && (
            <a
              href={cta.primaryButton.url}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-4 py-3 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              {cta.primaryButton.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {cta.secondaryButton && (
            <a
              href={cta.secondaryButton.url}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-teal/40 bg-white px-4 py-3 text-sm font-black text-deep-teal transition hover:border-teal hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {cta.secondaryButton.label}
            </a>
          )}
        </div>
      )}
    </section>
  );
}

function RelatedArticleLinks({ articles }) {
  if (!articles?.length) {
    return null;
  }

  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-xl font-black text-navy">Related Articles</h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {articles.map((relatedArticle) => (
          <a
            key={`${relatedArticle.title}-${relatedArticle.href}`}
            href={relatedArticle.href}
            className="flex items-center justify-between gap-4 px-4 py-4 text-sm font-black text-deep-teal transition hover:bg-[#f2fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            <span>
              {relatedArticle.title}
              {relatedArticle.category && (
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  {relatedArticle.category}
                </span>
              )}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function StructuredArticleContent({ article, tocItems }) {
  const guideLayout = article.guideLayout;
  const relatedArticles = article.relatedArticles?.length
    ? article.relatedArticles
    : guideLayout.relatedArticles;

  return (
    <article className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-panel ring-1 ring-white/70 sm:p-8 lg:col-span-6 lg:p-10">
      {tocItems.length > 0 && (
        <details className="mb-8 rounded-lg border border-aqua/35 bg-aqua/10 p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-black text-deep-teal">
            On this page
          </summary>
          <div className="mt-3">
            {tocItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-md px-2 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-deep-teal"
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      )}

      <ArticleFeaturedImage article={article} />

      {guideLayout.overview && (
        <ArticleSection id="overview" title="Overview">
          <p className="text-slate-700">{guideLayout.overview}</p>
        </ArticleSection>
      )}

      {guideLayout.beforeYouStart?.length > 0 && (
        <ArticleSection id="before-you-start" title="Before You Start">
          <ul className="space-y-3">
            {guideLayout.beforeYouStart.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
          {guideLayout.beforeYouStartCallout && (
            <InfoCallout>{guideLayout.beforeYouStartCallout}</InfoCallout>
          )}
        </ArticleSection>
      )}

      {guideLayout.steps.map((step) => (
        <ArticleSection key={step.title} id={slugify(step.title)} title={step.title}>
          {step.intro && <p className="text-slate-700">{step.intro}</p>}
          {step.checklist.length > 0 && (
            <ul className={`${step.intro ? "mt-4" : ""} space-y-3`}>
              {step.checklist.map((item) => (
                <CheckListItem key={item}>{item}</CheckListItem>
              ))}
            </ul>
          )}
          {step.screenshotPlaceholder?.enabled &&
            (step.screenshotPlaceholder?.label || step.screenshotPlaceholder?.image?.url) && (
            <ScreenshotPlaceholder
              icon={getIcon(step.screenshotPlaceholder.icon, Monitor)}
              image={step.screenshotPlaceholder.image}
              alt={step.screenshotPlaceholder.alt || step.screenshotPlaceholder.label}
              label={step.screenshotPlaceholder.label}
              caption={step.screenshotPlaceholder.caption}
            />
          )}
          {step.infoCards?.length > 0 && <GuideInfoCardGrid cards={step.infoCards} />}
          {step.callout?.body &&
            (step.callout.type === "warning" ? (
              <WarningCallout>{step.callout.body}</WarningCallout>
            ) : (
              <InfoCallout>{step.callout.body}</InfoCallout>
            ))}
        </ArticleSection>
      ))}

      {guideLayout.extraSections?.map((section) => (
        <ArticleSection key={section.title} id={slugify(section.title)} title={section.title}>
          {section.checklist.length > 0 && (
            <ul className="space-y-3">
              {section.checklist.map((item) => (
                <CheckListItem key={item}>{item}</CheckListItem>
              ))}
            </ul>
          )}
        </ArticleSection>
      ))}

      {guideLayout.troubleshooting?.length > 0 && (
        <ArticleSection id="troubleshooting" title="Troubleshooting">
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {guideLayout.troubleshooting.map((item, index) => (
              <details key={item.title} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-black text-navy">
                  {item.title}
                  <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                </summary>
                <p className="px-4 pb-4 text-sm leading-7 text-slate-600">
                  {item.body || item.content}
                </p>
              </details>
            ))}
          </div>
        </ArticleSection>
      )}

      {guideLayout.bestPracticeTips?.length > 0 && (
        <ArticleSection id="best-practices" title="Best Practice Tips">
          <div className="grid gap-4 sm:grid-cols-2">
            {guideLayout.bestPracticeTips.map((tip) => {
              const Icon = getIcon(tip.icon, ShieldCheck);

              return (
                <div
                  key={tip.title}
                  className="rounded-lg border border-slate-200/70 bg-[#f8fcfc] p-4 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-teal" aria-hidden="true" />
                  <p className="mt-3 text-sm font-black leading-6 text-navy">
                    {tip.title}
                  </p>
                  {tip.body && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tip.body}</p>
                  )}
                </div>
              );
            })}
          </div>
        </ArticleSection>
      )}
      {guideLayout.faqs?.length > 0 && (
        <ArticleSection id="frequently-asked-questions" title="Frequently Asked Questions">
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {guideLayout.faqs.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-black text-navy">
                  {faq.question}
                  <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                </summary>
                <p className="px-4 pb-4 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </ArticleSection>
      )}
      <ArticleCtaBlock cta={article.articleCTA} />
      <RelatedArticleLinks articles={relatedArticles} />
    </article>
  );
}

function ArticleSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CheckListItem({ children }) {
  return (
    <li className="flex gap-3 rounded-lg border border-slate-200/70 bg-[#f8fcfc] p-4 text-sm font-semibold leading-7 text-slate-700">
      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function InfoCallout({ children }) {
  return (
    <div className="mt-5 flex gap-3 rounded-lg border border-aqua/35 bg-aqua/10 p-4 text-sm font-semibold leading-7 text-deep-teal">
      <Info className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function WarningCallout({ children }) {
  return (
    <div className="mt-5 flex gap-3 rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">
      <AlertTriangle className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function ScreenshotPlaceholder({
  label,
  image,
  alt,
  caption,
  icon: Icon = Monitor,
}) {
  if (image?.url) {
    return (
      <figure className="mt-6 overflow-hidden rounded-lg border border-slate-200/70 bg-slate-50 shadow-soft">
        <img
          src={image.url}
          alt={alt || image.alt || label || "Article screenshot"}
          className="aspect-[16/9] w-full object-cover"
        />
        {(label || caption) && (
          <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
            {label && <span className="font-black text-navy">{label}</span>}
            {label && caption && <span className="mx-1 text-slate-400">-</span>}
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-dashed border-aqua/60 bg-gradient-to-br from-aqua/15 to-white p-6 text-center">
      <Icon className="mx-auto h-8 w-8 text-teal" aria-hidden="true" />
      <p className="mt-3 text-sm font-black text-navy">{label}</p>
    </div>
  );
}

function GuideInfoCardGrid({ cards }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = getIcon(card.icon, Info);

        return (
          <div key={card.title} className="rounded-lg border border-aqua/35 bg-aqua/10 p-4">
            <Icon className="h-5 w-5 text-teal" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-black leading-6 text-navy">
              {card.title}
            </h3>
            {card.body && (
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getLexicalPlainText(node) {
  if (!node) {
    return "";
  }

  if (typeof node.text === "string") {
    return node.text;
  }

  if (!Array.isArray(node.children)) {
    return "";
  }

  return node.children.map(getLexicalPlainText).join("");
}

function renderLexicalContent(content) {
  const children = content?.root?.children;

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <p>
        Article content is ready to be authored in Payload. Add rich text content
        in the admin to publish the full guide.
      </p>
    );
  }

  return children.map((node, index) => renderLexicalNode(node, index));
}

function renderLexicalChildren(node, keyPrefix) {
  if (!Array.isArray(node?.children)) {
    return null;
  }

  return node.children.map((child, index) =>
    renderLexicalNode(child, `${keyPrefix}-${index}`),
  );
}

function renderLexicalText(node, key) {
  const format = Number(node.format || 0);
  const className = [
    format & 1 ? "font-bold" : "",
    format & 2 ? "italic" : "",
    format & 8 ? "underline" : "",
    format & 16 ? "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-navy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span key={key} className={className || undefined}>
      {node.text}
    </span>
  );
}

function renderLexicalNode(node, key) {
  if (!node) {
    return null;
  }

  if (node.type === "text") {
    return renderLexicalText(node, key);
  }

  if (node.type === "heading") {
    const HeadingTag = /^h[1-6]$/.test(node.tag) ? node.tag : "h2";
    const headingText = getLexicalPlainText(node);

    return (
      <HeadingTag
        key={key}
        id={headingText ? slugify(headingText) : undefined}
        className="mt-8 scroll-mt-28 text-2xl font-black text-navy"
      >
        {renderLexicalChildren(node, key)}
      </HeadingTag>
    );
  }

  if (node.type === "paragraph") {
    return (
      <p key={key} className="mt-5 first:mt-0">
        {renderLexicalChildren(node, key)}
      </p>
    );
  }

  if (node.type === "list") {
    const ListTag = node.listType === "number" ? "ol" : "ul";

    return (
      <ListTag key={key} className="mt-5 space-y-3 pl-6">
        {renderLexicalChildren(node, key)}
      </ListTag>
    );
  }

  if (node.type === "listitem") {
    return (
      <li key={key} className="pl-1">
        {renderLexicalChildren(node, key)}
      </li>
    );
  }

  return (
    <div key={key} className="mt-5">
      {renderLexicalChildren(node, key)}
    </div>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-[980px] px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-aqua/25 text-deep-teal">
        <BookOpen className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-4xl font-black text-navy">Page not found</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
        This article or category may still be a draft in Payload, or the link may
        have changed.
      </p>
      <a
        href={supportHubPath}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal to-deep-teal px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
      >
        Back to Support Hub
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </main>
  );
}

export default function App() {
  const { articles, categories, error, loading, resources, settings } =
    useKnowledgeData();
  const path = useCurrentPath();
  const articleSlug = path.startsWith(`${articlePathPrefix}/`)
    ? path.slice(`${articlePathPrefix}/`.length)
    : path.startsWith(`${supportArticlePathPrefix}/`)
      ? path.slice(`${supportArticlePathPrefix}/`.length)
    : "";
  const categorySlug = path.startsWith(`${categoryPathPrefix}/`)
    ? path.slice(`${categoryPathPrefix}/`.length)
    : "";
  const article = articleSlug
    ? articles.find((item) => item.slug === articleSlug)
    : null;

  const page = useMemo(() => {
    if (path === "/" || path === supportHubPath || path === "/knowledge-base") {
      return (
        <SupportHubHome
          articles={articles}
          categories={categories}
          error={error}
          loading={loading}
          settings={settings}
        />
      );
    }

    if (path === `${supportHubPath}/articles`) {
      return <ListingPage articles={articles} categories={categories} />;
    }

    if (categorySlug) {
      return (
        <ListingPage
          articles={articles}
          categories={categories}
          categorySlug={categorySlug}
        />
      );
    }

    if (articleSlug) {
      if (articleSlug === "downloads-resources-overview") {
        return <ResourceHubTemplate resources={resources} />;
      }

      return <ArticlePage article={article} categories={categories} />;
    }

    return <NotFound />;
  }, [
    article,
    articleSlug,
    articles,
    categories,
    categorySlug,
    error,
    loading,
    path,
    resources,
    settings,
  ]);

  return (
    <div className="min-h-screen bg-[#f7fafb] text-navy">
      <Header />
      {page}
      <Footer />
    </div>
  );
}
