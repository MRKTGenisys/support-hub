export const resourceCategoryFilters = [
  "All",
  "Email Security",
  "Security Awareness",
  "Endpoint Security",
  "Compliance",
  "Microsoft 365",
];

export const resourceCategoryCards = [
  {
    title: "Email Security",
    description:
      "PDF guides for improving mailbox protection, email authentication and phishing resilience.",
    iconKey: "mail",
    exampleResources: [
      "Mimecast CI - Outlook Junk Mail Guide",
      "DMARC Guide",
      "Email protection reference material",
    ],
  },
  {
    title: "Security Awareness",
    description:
      "Training resources that help users recognise phishing, social engineering and risky behaviour.",
    iconKey: "shield-check",
    exampleResources: [
      "Mimecast Security Awareness Training",
      "Phishing simulation overview",
      "Cyber security learning modules",
    ],
  },
  {
    title: "Endpoint Security",
    description:
      "Downloadable resources for endpoint protection, application control and secure user workflows.",
    iconKey: "monitor",
    exampleResources: [
      "ThreatLocker End-User Guide",
      "Blocked application guidance",
      "Access request process",
    ],
  },
  {
    title: "Compliance",
    description:
      "Templates, advisories and reference material for practical governance and compliance improvements.",
    iconKey: "list-checks",
    exampleResources: [
      "Email authentication guidance",
      "Domain protection resources",
      "Policy and checklist material",
    ],
  },
  {
    title: "Microsoft 365",
    description:
      "Downloads that support Microsoft 365 security, productivity and everyday user operations.",
    iconKey: "cloud",
    exampleResources: [
      "Outlook support resources",
      "Microsoft 365 security guides",
      "Productivity support downloads",
    ],
  },
];

export const fallbackPdfResources = [
  {
    title: "Mimecast CI - Outlook Junk Mail Guide",
    slug: "mimecast-ci-outlook-junk-mail-guide",
    description:
      "Learn how to check Outlook junk mail, release legitimate messages and report junk or phishing emails.",
    category: "Email Security",
    resourceType: "PDF Guide",
    fileUpload: null,
    tags: ["Mimecast", "Outlook", "junk mail", "phishing", "email security"],
    featured: true,
    sortOrder: 10,
    status: "published",
    publishedAt: "2024-08-07T00:00:00.000Z",
  },
  {
    title: "Mimecast Security Awareness Training",
    slug: "mimecast-security-awareness-training",
    description:
      "Overview of Mimecast Security Awareness Training, phishing simulation and cyber security learning modules.",
    category: "Security Awareness",
    resourceType: "PDF Guide",
    fileUpload: null,
    tags: [
      "Mimecast",
      "security awareness",
      "phishing simulation",
      "training",
    ],
    featured: true,
    sortOrder: 20,
    status: "published",
    publishedAt: "2024-08-07T00:00:00.000Z",
  },
  {
    title: "ThreatLocker End-User Guide",
    slug: "threatlocker-end-user-guide",
    description:
      "Learn what ThreatLocker is, how blocked applications are handled and how to request access for approved applications.",
    category: "Endpoint Security",
    resourceType: "PDF Guide",
    fileUpload: null,
    tags: ["ThreatLocker", "endpoint security", "application control"],
    featured: false,
    sortOrder: 30,
    status: "published",
    publishedAt: "2024-06-06T00:00:00.000Z",
  },
  {
    title: "DMARC Guide",
    slug: "dmarc-guide",
    description:
      "Email authentication and domain protection resource for improving email security and reducing spoofing risk.",
    category: "Email Security",
    resourceType: "PDF Guide",
    fileUpload: null,
    tags: ["DMARC", "email authentication", "domain protection", "spoofing"],
    featured: false,
    sortOrder: 40,
    status: "published",
    publishedAt: "2024-08-29T00:00:00.000Z",
  },
];
