import { getPayload } from "payload";
import { existsSync } from "node:fs";
import path from "node:path";

import config from "../payload.config";

const payload = await getPayload({ config });
const resourcePdfBasePath =
  "/Volumes/Expansion/3. WORK RELATED/📁 Genisys/05. Marketing Materials/Product Brochures";

const categories = [
  {
    title: "Cyber Security",
    slug: "cyber-security",
    description: "Stay informed on threats, alerts and best practices.",
    icon: "shield-check",
    sortOrder: 10,
  },
  {
    title: "Cloud & Microsoft 365",
    slug: "cloud-microsoft-365",
    description: "Guides, how-tos and support for Microsoft services.",
    icon: "cloud",
    sortOrder: 20,
  },
  {
    title: "Microsoft 365 / Email Support",
    slug: "microsoft-365-email-support",
    description: "Outlook, Exchange Online and Microsoft 365 email support guides.",
    icon: "mail",
    sortOrder: 25,
  },
  {
    title: "VPN / Remote Access",
    slug: "vpn-remote-access",
    description: "VPN setup, secure remote access and connection troubleshooting guides.",
    icon: "wifi",
    sortOrder: 28,
  },
  {
    title: "Connectivity & Voice",
    slug: "connectivity-voice",
    description: "Troubleshooting for internet, networks and voice services.",
    icon: "phone",
    sortOrder: 30,
  },
  {
    title: "Managed IT Services",
    slug: "managed-it-services",
    description: "Device support, onboarding and IT request guides.",
    icon: "monitor",
    sortOrder: 40,
  },
  {
    title: "Downloads & Resources",
    slug: "downloads-resources",
    description: "Access policies, guides and helpful downloads.",
    icon: "download",
    sortOrder: 50,
  },
  {
    title: "Getting Started",
    slug: "getting-started",
    description: "Onboarding, access and first steps with Genisys support.",
    icon: "list-checks",
    sortOrder: 60,
  },
];

const categoryBySlug = new Map<string, { id: number | string }>();
const articleBySlug = new Map<string, { id: number | string }>();
const resourceFileByName = new Map<string, { id: number | string }>();

async function upsertCategory(category: (typeof categories)[number]) {
  const existing = await payload.find({
    collection: "knowledge-categories",
    limit: 1,
    where: {
      slug: {
        equals: category.slug,
      },
    },
  });

  const doc = existing.docs[0]
    ? await payload.update({
        collection: "knowledge-categories",
        id: existing.docs[0].id,
        data: category,
      })
    : await payload.create({
        collection: "knowledge-categories",
        data: category,
      });

  categoryBySlug.set(category.slug, doc);
}

function textNode(text: string, format = 0) {
  return {
    type: "text",
    version: 1,
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
  };
}

function paragraphNode(text: string) {
  return {
    type: "paragraph",
    version: 1,
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
  };
}

function headingNode(text: string, tag = "h2") {
  return {
    type: "heading",
    version: 1,
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    tag,
  };
}

function listNode(items: string[], listType: "bullet" | "number" = "bullet") {
  return {
    type: "list",
    version: 1,
    children: items.map((item, index) => ({
      type: "listitem",
      version: 1,
      checked: undefined,
      children: [textNode(item)],
      direction: "ltr",
      format: "",
      indent: 0,
      value: index + 1,
    })),
    direction: "ltr",
    format: "",
    indent: 0,
    listType,
    start: 1,
    tag: listType === "number" ? "ol" : "ul",
  };
}

function lexicalContent(paragraphs: string[]) {
  return lexicalBlocks(paragraphs.map((text) => paragraphNode(text)));
}

function lexicalBlocks(children: unknown[]) {
  return {
    root: {
      type: "root",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

function normaliseSeo(
  seo:
    | {
        title?: string;
        description?: string;
        primaryKeyword?: string;
        secondaryKeywords?: string[];
      }
    | undefined,
) {
  if (!seo) {
    return undefined;
  }

  return {
    ...seo,
    secondaryKeywords: Array.isArray(seo.secondaryKeywords)
      ? seo.secondaryKeywords.map((keyword) => ({ keyword }))
      : [],
  };
}

const outlookArticleContent = lexicalBlocks([
  paragraphNode(
    "If Outlook is not sending, receiving or updating messages correctly, the issue is often caused by connection state, mailbox sync settings, cached data or a local profile problem. Work through these checks before escalating the issue to support."
  ),
  headingNode("Before You Start"),
  listNode([
    "Confirm your device is connected to the internet.",
    "Check whether Outlook is affected on one device only or across desktop, web and mobile.",
    "Keep your Microsoft 365 email address and affected device name handy.",
    "If you see an error code, copy it before restarting Outlook.",
  ]),
  headingNode("1. Check Outlook Connection Status"),
  paragraphNode(
    "Open Outlook and look at the bottom status bar. If Outlook shows Working Offline, Disconnected or Trying to Connect, it may not be syncing with Microsoft 365."
  ),
  listNode([
    "Select Send / Receive.",
    "Make sure Work Offline is not enabled.",
    "Restart Outlook after changing the connection state.",
    "If you are using a VPN, disconnect and reconnect to test whether the VPN is affecting mail sync.",
  ]),
  headingNode("2. Confirm Microsoft 365 Is Available"),
  paragraphNode(
    "If Outlook is affected across multiple users or devices, the issue may be service related rather than local to your computer."
  ),
  listNode([
    "Open Outlook on the web and confirm whether new messages appear there.",
    "Check the Genisys System Status panel or the Microsoft 365 service health information available to your organisation.",
    "If webmail works but desktop Outlook does not, continue with the local troubleshooting steps.",
  ]),
  headingNode("3. Restart Outlook and the Device"),
  paragraphNode(
    "A restart can clear stuck send/receive processes, temporary authentication issues and local network changes."
  ),
  listNode([
    "Close Outlook completely.",
    "Restart your computer or mobile device.",
    "Open Outlook again and allow several minutes for folders to update.",
  ]),
  headingNode("4. Check Mailbox and Folder Sync"),
  paragraphNode(
    "Large mailboxes, shared mailboxes and folders with many items can take longer to update, especially after password changes, profile changes or device rebuilds."
  ),
  listNode([
    "Check whether the issue affects all folders or only one folder.",
    "Confirm that Focused Inbox, filters or sorting are not hiding expected messages.",
    "Use Outlook search to confirm whether the message exists in another folder.",
    "For shared mailboxes, check whether the mailbox opens correctly in Outlook on the web.",
  ]),
  headingNode("5. Update Outlook"),
  paragraphNode(
    "Outdated Office builds can cause authentication, calendar and mailbox sync issues."
  ),
  listNode([
    "Open any Microsoft Office app.",
    "Go to Account or Office Account.",
    "Select Update Options, then Update Now.",
    "Restart Outlook after updates are installed.",
  ]),
  headingNode("6. Rebuild the Outlook Profile"),
  paragraphNode(
    "If Outlook on the web is working and only desktop Outlook is affected, the local Outlook profile may need to be recreated."
  ),
  listNode([
    "Close Outlook.",
    "Open Control Panel and select Mail.",
    "Choose Show Profiles.",
    "Create a new Outlook profile and add your Microsoft 365 account.",
    "Open Outlook with the new profile and allow the mailbox to resync.",
  ]),
  headingNode("When to Contact Genisys Support"),
  paragraphNode(
    "If the issue continues after these checks, contact Genisys Support so we can review the mailbox, Microsoft 365 service state and device configuration."
  ),
  listNode([
    "Your email address.",
    "The device name and operating system.",
    "Whether Outlook on the web is working.",
    "Any visible error messages or screenshots.",
    "When the issue started and whether other users are affected.",
  ]),
]);

const outlookGuideLayout = {
  enabled: true,
  beforeYouStart: [
    { item: "Confirm your device is connected to the internet." },
    {
      item: "Check whether Outlook is affected on one device only or across desktop, web and mobile.",
    },
    { item: "Keep your Microsoft 365 email address and affected device name handy." },
    { item: "Copy any visible error code before restarting Outlook." },
  ],
  beforeYouStartCallout:
    "If Outlook on the web is also affected, the issue may be service related. Check the Genisys System Status panel before recreating profiles or changing device settings.",
  steps: [
    {
      title: "Step 1: Check Outlook Connection Status",
      intro:
        "Open Outlook and look at the bottom status bar. If Outlook shows Working Offline, Disconnected or Trying to Connect, it may not be syncing with Microsoft 365.",
      checklist: [
        { item: "Select Send / Receive." },
        { item: "Make sure Work Offline is not enabled." },
        { item: "Restart Outlook after changing the connection state." },
        {
          item: "If you are using a VPN, disconnect and reconnect to test whether it is affecting mail sync.",
        },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Outlook connection status bar",
        icon: "mail",
      },
      callout: {
        type: "info",
        body: "Working Offline is one of the most common causes of Outlook appearing to stop receiving new messages.",
      },
    },
    {
      title: "Step 2: Confirm Microsoft 365 Is Available",
      intro:
        "If Outlook is affected across multiple users or devices, the issue may be service related rather than local to your computer.",
      checklist: [
        { item: "Open Outlook on the web and confirm whether new messages appear there." },
        {
          item: "Check the Genisys System Status panel or your organisation's Microsoft 365 service health information.",
        },
        {
          item: "If webmail works but desktop Outlook does not, continue with the local troubleshooting steps.",
        },
      ],
      infoCards: [
        {
          title: "Outlook on the web works",
          body: "Focus on the desktop or mobile app, local cache, profile or device connection.",
          icon: "cloud",
        },
        {
          title: "Outlook on the web is affected",
          body: "The mailbox, Microsoft 365 service state or account access may need to be checked.",
          icon: "shield-alert",
        },
      ],
    },
    {
      title: "Step 3: Restart Outlook and the Device",
      intro:
        "A restart can clear stuck send/receive processes, temporary authentication issues and local network changes.",
      checklist: [
        { item: "Close Outlook completely." },
        { item: "Restart your computer or mobile device." },
        { item: "Open Outlook again and allow several minutes for folders to update." },
      ],
      infoCards: [
        {
          title: "Allow time to resync",
          body: "Large mailboxes and shared mailboxes may take longer to refresh after Outlook restarts.",
          icon: "clock",
        },
      ],
    },
    {
      title: "Step 4: Check Mailbox and Folder Sync",
      intro:
        "Large mailboxes, shared mailboxes and folders with many items can take longer to update, especially after password changes, profile changes or device rebuilds.",
      checklist: [
        { item: "Check whether the issue affects all folders or only one folder." },
        { item: "Confirm that Focused Inbox, filters or sorting are not hiding expected messages." },
        { item: "Use Outlook search to confirm whether the message exists in another folder." },
        { item: "For shared mailboxes, check whether the mailbox opens correctly in Outlook on the web." },
      ],
    },
    {
      title: "Step 5: Update Outlook",
      intro:
        "Outdated Office builds can cause authentication, calendar and mailbox sync issues.",
      checklist: [
        { item: "Open any Microsoft Office app." },
        { item: "Go to Account or Office Account." },
        { item: "Select Update Options, then Update Now." },
        { item: "Restart Outlook after updates are installed." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft Office update options",
        icon: "monitor",
      },
    },
    {
      title: "Step 6: Rebuild the Outlook Profile",
      intro:
        "If Outlook on the web is working and only desktop Outlook is affected, the local Outlook profile may need to be recreated.",
      checklist: [
        { item: "Close Outlook." },
        { item: "Open Control Panel and select Mail." },
        { item: "Choose Show Profiles." },
        { item: "Create a new Outlook profile and add your Microsoft 365 account." },
        { item: "Open Outlook with the new profile and allow the mailbox to resync." },
      ],
      callout: {
        type: "warning",
        body: "Only rebuild the profile after checking Outlook on the web and basic connection status. If you are unsure, contact Genisys Support first.",
      },
    },
  ],
  troubleshooting: [
    {
      title: "Outlook on the web works but desktop Outlook does not",
      content:
        "The issue is likely local to the Outlook app, cached mailbox data, profile or device network state. Work through updates and profile checks.",
    },
    {
      title: "Only one folder is not updating",
      content:
        "Check folder filters, sorting, Focused Inbox and whether the item has moved to another folder. Large folders can also take longer to refresh.",
    },
    {
      title: "Shared mailbox content is delayed",
      content:
        "Shared mailboxes can take longer to sync in desktop Outlook. Confirm the mailbox opens in Outlook on the web before escalating.",
    },
    {
      title: "Outlook shows password or sign-in prompts",
      content:
        "Restart Outlook and confirm your Microsoft 365 sign-in works in the browser. Repeated prompts may need account or device authentication checks.",
    },
  ],
  bestPracticeTips: [
    { title: "Keep Outlook and Office apps updated", icon: "check-circle" },
    { title: "Check Outlook on the web before rebuilding profiles", icon: "cloud" },
    { title: "Copy error codes before restarting", icon: "info" },
    { title: "Avoid interrupting large mailbox resyncs", icon: "clock" },
    { title: "Contact Genisys Support if multiple users are affected", icon: "headphones" },
  ],
};

const vpnArticleContent = lexicalBlocks([
  paragraphNode(
    "A Virtual Private Network (VPN) allows you to securely connect to your organisation's network when working remotely. Once connected, you can safely access company resources such as shared drives, internal applications, printers and other systems that may not be available from the public internet."
  ),
  paragraphNode(
    "This guide explains how to connect to a Genisys-managed VPN on a Windows 11 device."
  ),
  headingNode("Before You Begin"),
  listNode([
    "A Windows 11 device.",
    "An active internet connection.",
    "Your VPN username and password.",
    "Multi-Factor Authentication (MFA) access, if required.",
    "A Genisys-provided VPN profile already installed on your device.",
  ]),
  headingNode("How to Connect to the VPN"),
  headingNode("Method 1: Using the Quick Settings Menu", "h3"),
  listNode(
    [
      "Click the Network icon in the bottom-right corner of the taskbar.",
      "Select VPN.",
      "Locate your company VPN connection.",
      "Click Connect.",
      "Enter your credentials if prompted.",
      "Complete Multi-Factor Authentication if required.",
    ],
    "number",
  ),
  headingNode("Method 2: Using Windows Settings", "h3"),
  listNode(
    [
      "Click Start.",
      "Open Settings.",
      "Select Network & Internet.",
      "Click VPN.",
      "Select your company VPN connection.",
      "Click Connect.",
      "Enter your credentials if prompted.",
    ],
    "number",
  ),
  headingNode("Verify the VPN Connection"),
  listNode(
    [
      "Open File Explorer.",
      "Access a company network drive.",
      "Open any internal business application.",
      "Confirm resources are available.",
    ],
    "number",
  ),
  headingNode("Disconnecting from the VPN"),
  listNode(
    [
      "Click the Network icon in the taskbar.",
      "Select VPN.",
      "Choose the active VPN connection.",
      "Click Disconnect.",
    ],
    "number",
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if the VPN profile is missing, authentication continually fails, company resources remain unavailable after connecting, the VPN disconnects repeatedly or you receive unexpected security warnings."
  ),
]);

const vpnGuideLayout = {
  enabled: true,
  overview:
    "A Virtual Private Network (VPN) allows you to securely connect to your organisation's network when working remotely. Once connected, you can safely access company resources such as shared drives, internal applications, printers and other systems that may not be available from the public internet. This guide explains how to connect to a Genisys-managed VPN on a Windows 11 device.",
  beforeYouStart: [
    { item: "A Windows 11 device." },
    { item: "An active internet connection." },
    { item: "Your VPN username and password." },
    { item: "Multi-Factor Authentication (MFA) access, if required." },
    { item: "A Genisys-provided VPN profile already installed on your device." },
  ],
  beforeYouStartCallout:
    "If you do not have VPN credentials or the VPN profile installed, contact your IT support team before proceeding.",
  steps: [
    {
      title: "Step 1: Connect Using the Quick Settings Menu",
      intro: "Use the Windows 11 Quick Settings menu when you need the fastest path to your VPN connection.",
      checklist: [
        { item: "Click the Network icon in the bottom-right corner of the taskbar." },
        { item: "Select VPN." },
        { item: "Locate your company VPN connection." },
        { item: "Click Connect." },
        { item: "Enter your credentials if prompted." },
        { item: "Complete Multi-Factor Authentication if required." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Windows 11 Quick Settings VPN menu",
        icon: "wifi",
      },
      callout: {
        type: "info",
        body: "Once connected, Windows will display a Connected status.",
      },
    },
    {
      title: "Step 2: Connect Using Windows Settings",
      intro: "Use Windows Settings if the VPN option is not visible in Quick Settings or you need to review the saved VPN profile.",
      checklist: [
        { item: "Click Start." },
        { item: "Open Settings." },
        { item: "Select Network & Internet." },
        { item: "Click VPN." },
        { item: "Select your company VPN connection." },
        { item: "Click Connect." },
        { item: "Enter your credentials if prompted." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Windows 11 VPN settings page",
        icon: "monitor",
      },
    },
    {
      title: "Step 3: Verify the VPN Connection",
      intro: "After connecting, confirm that company resources are available before starting work.",
      checklist: [
        { item: "Open File Explorer." },
        { item: "Access a company network drive." },
        { item: "Open any internal business application." },
        { item: "Confirm resources are available." },
      ],
      infoCards: [
        {
          title: "Taskbar status",
          body: "You may also notice a VPN icon displayed in the Windows taskbar.",
          icon: "wifi",
        },
      ],
    },
    {
      title: "Step 4: Disconnect from the VPN",
      intro: "Disconnect from the VPN when you have finished working, unless your organisation requires you to stay connected.",
      checklist: [
        { item: "Click the Network icon in the taskbar." },
        { item: "Select VPN." },
        { item: "Choose the active VPN connection." },
        { item: "Click Disconnect." },
      ],
      callout: {
        type: "info",
        body: "Some organisations require users to remain connected during working hours. Follow your company's IT policy where applicable.",
      },
    },
  ],
  extraSections: [
    {
      title: "When to Contact Support",
      checklist: [
        { item: "The VPN profile is missing." },
        { item: "Authentication continually fails." },
        { item: "You cannot access company resources after connecting." },
        { item: "The VPN disconnects repeatedly." },
        { item: "You receive unexpected security warnings." },
        { item: "Provide screenshots of any error messages to assist faster troubleshooting." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "VPN Will Not Connect",
      content:
        "Confirm your internet connection is active, your username and password are correct, MFA was approved, the VPN profile is installed correctly and the VPN server is available. Try disconnecting and reconnecting after a few minutes.",
    },
    {
      title: "Authentication Failed",
      content:
        "Confirm your password is correct, reset it if required, ensure your MFA application is working and verify your account has not been locked. If the issue continues, contact your IT support team.",
    },
    {
      title: "Connected But Cannot Access Company Resources",
      content:
        "Disconnect and reconnect the VPN, restart your computer, verify access from another device and confirm the required network drives or applications are still available. This issue may indicate a routing or permissions problem.",
    },
    {
      title: "VPN Keeps Disconnecting",
      content:
        "Frequent disconnections are often caused by unstable internet, Wi-Fi signal issues, ISP interruptions, VPN software updates or security software conflicts. Switching to a wired connection can often improve stability.",
    },
  ],
  bestPracticeTips: [
    {
      title: "Always connect before accessing company resources",
      icon: "shield-check",
    },
    {
      title: "Lock your device when unattended",
      icon: "lock",
    },
    {
      title: "Do not share VPN credentials",
      icon: "shield-alert",
    },
    {
      title: "Keep Windows and security software up to date",
      icon: "check-circle",
    },
    {
      title: "Report suspicious login activity immediately",
      icon: "headphones",
    },
  ],
  faqs: [
    {
      question: "What does a VPN do?",
      answer:
        "A VPN encrypts your connection and securely routes traffic between your device and your organisation's network.",
    },
    {
      question: "Can I use the VPN on public Wi-Fi?",
      answer:
        "Yes. Using the VPN on public Wi-Fi is strongly recommended to help protect company data.",
    },
    {
      question: "Why am I being asked for Multi-Factor Authentication?",
      answer:
        "MFA provides an additional layer of security and helps protect your account from unauthorised access.",
    },
    {
      question: "Do I need to stay connected all day?",
      answer:
        "This depends on your organisation's configuration. Some applications may require an active VPN connection at all times.",
    },
  ],
};

const phishingArticleContent = lexicalBlocks([
  paragraphNode(
    "Phishing emails are fraudulent messages designed to trick recipients into revealing passwords, financial information, business data or other sensitive information. Cybercriminals often impersonate trusted organisations, colleagues, suppliers or Microsoft 365 services to make their messages appear legitimate."
  ),
  paragraphNode(
    "Knowing how to identify and respond to phishing emails is one of the most effective ways to protect both your organisation and your personal information."
  ),
  paragraphNode(
    "This guide explains how to recognise phishing attempts, what actions to take, and when to contact your IT support team."
  ),
  headingNode("What Is a Phishing Email?"),
  paragraphNode("A phishing email is a malicious message that attempts to:"),
  listNode([
    "Steal usernames and passwords.",
    "Obtain banking or payment information.",
    "Deliver malware or ransomware.",
    "Gain access to company systems.",
    "Trick users into transferring money.",
    "Harvest personal information.",
  ]),
  paragraphNode(
    "Modern phishing attacks often appear highly convincing and may closely resemble genuine communications from Microsoft, banks, suppliers, couriers or internal staff."
  ),
  headingNode("Common Signs of a Phishing Email"),
  listNode([
    "Unexpected attachments.",
    "Requests for passwords.",
    "Urgent or threatening language.",
    "Unusual payment requests.",
    "Links to unfamiliar websites.",
    "Poor spelling or grammar.",
    "Unexpected login prompts.",
    "Messages claiming your account will be suspended.",
  ]),
  headingNode("Step 1: Do Not Click Any Links"),
  listNode([
    "Do not click links.",
    "Do not open attachments.",
    "Do not reply to the sender.",
    "Do not provide personal information.",
  ]),
  headingNode("Step 2: Verify the Sender"),
  listNode(
    [
      "Review the sender's email address.",
      "Check for unusual spelling.",
      "Compare the address with previous legitimate emails.",
      "Be cautious of addresses that appear similar but are not exact matches.",
    ],
    "number",
  ),
  headingNode("Step 3: Report the Email"),
  listNode(
    [
      "Select the suspicious email.",
      "Click Report Message.",
      "Choose Phishing.",
      "Submit the report.",
    ],
    "number",
  ),
  headingNode("Step 4: Delete the Email"),
  listNode(
    [
      "Delete the message.",
      "Empty Deleted Items if instructed by IT.",
      "Avoid interacting with the message further.",
    ],
    "number",
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk immediately if you clicked a suspicious link, opened a suspicious attachment, entered credentials into a website, believe your account may be compromised or notice unusual account activity."
  ),
]);

const authenticatorSetupContent = lexicalBlocks([
  paragraphNode(
    "Microsoft Authenticator is a free mobile application that helps protect your Microsoft 365 account using Multi-Factor Authentication (MFA)."
  ),
  paragraphNode(
    "Once configured, Microsoft Authenticator allows you to securely approve sign-in requests, verify your identity and protect your account from unauthorised access."
  ),
  paragraphNode(
    "This guide explains how to install Microsoft Authenticator, register your account and troubleshoot common setup issues."
  ),
  headingNode("What Is Microsoft Authenticator?"),
  paragraphNode("Microsoft Authenticator is a security application available for iPhone and Android devices."),
  listNode([
    "MFA approval notifications.",
    "Number matching verification.",
    "One-time passcodes.",
    "Passwordless sign-in support.",
    "Secure account verification.",
  ]),
  headingNode("Why Is Microsoft Authenticator Important?"),
  paragraphNode(
    "Passwords can be stolen through phishing attacks, malware, credential theft and data breaches. Microsoft Authenticator adds an additional layer of protection by requiring approval from your trusted mobile device."
  ),
  headingNode("Before You Start"),
  listNode([
    "Install Microsoft Authenticator on your mobile device.",
    "Confirm you can access your Microsoft 365 account.",
    "Keep your computer and mobile device available during setup.",
    "Ensure your mobile device has internet access.",
    "Enable notifications on your phone.",
  ]),
  headingNode("Download Microsoft Authenticator"),
  listNode([
    "For iPhone, open the App Store, search for Microsoft Authenticator, select Install and open the app when installation is complete.",
    "For Android, open Google Play Store, search for Microsoft Authenticator, select Install and open the app when installation is complete.",
    "Only install the official Microsoft Authenticator application.",
  ]),
  headingNode("Step 1: Sign In to Microsoft 365"),
  listNode(
    [
      "Open the Microsoft 365 sign-in page.",
      "Enter your work email address.",
      "Enter your password.",
      "Select Sign In.",
      "Select Next if MFA registration is required.",
    ],
    "number",
  ),
  headingNode("Step 2: Select Microsoft Authenticator"),
  listNode(
    [
      "Choose Microsoft Authenticator as your preferred authentication method.",
      "Click Next.",
      "Follow the registration prompts.",
    ],
    "number",
  ),
  headingNode("Step 3: Add Your Work Account"),
  listNode(
    [
      "Open Microsoft Authenticator on your mobile device.",
      "Tap the Add Account button.",
      "Select Work or School Account.",
      "Choose Scan QR Code.",
    ],
    "number",
  ),
  headingNode("Step 4: Scan the QR Code"),
  listNode(
    [
      "Wait for the QR code to appear on your computer.",
      "Use Microsoft Authenticator to scan the code.",
      "Wait for the account to be added successfully.",
      "Confirm your Microsoft 365 account appears within the application.",
    ],
    "number",
  ),
  headingNode("Step 5: Complete the Verification Test"),
  listNode(
    [
      "Review the notification on your mobile device.",
      "Open Microsoft Authenticator.",
      "Approve the sign-in request.",
      "Enter the displayed number if prompted.",
    ],
    "number",
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if you changed phones, cannot scan the QR code, MFA notifications are not arriving, the app is not working correctly, you cannot access your account or you need your MFA method reset."
  ),
]);

const authenticatorSetupGuideLayout = {
  enabled: true,
  overview:
    "Microsoft Authenticator is a free mobile application that helps protect your Microsoft 365 account using Multi-Factor Authentication (MFA). Once configured, Microsoft Authenticator allows you to securely approve sign-in requests, verify your identity and protect your account from unauthorised access. This guide explains how to install Microsoft Authenticator, register your account and troubleshoot common setup issues.",
  beforeYouStart: [
    { item: "Install Microsoft Authenticator on your mobile device." },
    { item: "Confirm you can access your Microsoft 365 account." },
    { item: "Keep both your computer and mobile device available." },
    { item: "Ensure your mobile device has internet access." },
    { item: "Enable notifications on your phone." },
  ],
  beforeYouStartCallout:
    "Only install the official Microsoft Authenticator application from the Apple App Store or Google Play Store.",
  steps: [
    {
      title: "Step 1: Sign In to Microsoft 365",
      intro:
        "Start the setup from the Microsoft 365 sign-in page. If MFA registration is required, Microsoft will prompt you to configure additional security information.",
      checklist: [
        { item: "Open the Microsoft 365 sign-in page." },
        { item: "Enter your work email address." },
        { item: "Enter your password." },
        { item: "Select Sign In." },
        { item: "Select Next to continue when prompted for MFA registration." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft 365 security information prompt",
        icon: "monitor",
      },
    },
    {
      title: "Step 2: Select Microsoft Authenticator",
      intro:
        "Choose Microsoft Authenticator as your preferred authentication method and follow the registration prompts.",
      checklist: [
        { item: "Choose Microsoft Authenticator as your preferred authentication method." },
        { item: "Click Next." },
        { item: "Follow the registration prompts." },
        { item: "Wait while Microsoft prepares your account for registration." },
      ],
      infoCards: [
        {
          title: "Recommended method",
          body: "Microsoft Authenticator is generally preferred over SMS for stronger account protection.",
          icon: "shield-check",
        },
      ],
    },
    {
      title: "Step 3: Add Your Work Account",
      intro:
        "Open Microsoft Authenticator on your mobile device and add your Microsoft 365 work account.",
      checklist: [
        { item: "Open Microsoft Authenticator." },
        { item: "Tap the Add Account button." },
        { item: "Select Work or School Account." },
        { item: "Choose Scan QR Code." },
      ],
      callout: {
        type: "info",
        body: "The camera will open automatically when you choose Scan QR Code.",
      },
    },
    {
      title: "Step 4: Scan the QR Code",
      intro:
        "Use Microsoft Authenticator to scan the QR code shown on your computer during setup.",
      checklist: [
        { item: "Wait for the QR code to appear on your computer." },
        { item: "Use Microsoft Authenticator to scan the code." },
        { item: "Wait for the account to be added successfully." },
        { item: "Confirm your Microsoft 365 account appears within the application." },
      ],
      infoCards: [
        {
          title: "Keep both devices nearby",
          body: "You need your computer for the QR code and your phone to scan it.",
          icon: "smartphone",
        },
        {
          title: "Work account added",
          body: "After scanning, your Microsoft 365 account appears in the app.",
          icon: "check-circle",
        },
      ],
    },
    {
      title: "Step 5: Complete the Verification Test",
      intro:
        "Microsoft sends a test approval request to confirm the setup works correctly.",
      checklist: [
        { item: "Review the notification on your mobile device." },
        { item: "Open Microsoft Authenticator." },
        { item: "Approve the sign-in request." },
        { item: "Enter the displayed number if prompted." },
        { item: "Confirm registration is completed successfully." },
      ],
      callout: {
        type: "warning",
        body: "Never approve unexpected MFA requests. Unexpected prompts may indicate an attempted account compromise.",
      },
    },
  ],
  extraSections: [
    {
      title: "What Is Microsoft Authenticator?",
      checklist: [
        { item: "Microsoft Authenticator is available for iPhone (iOS) and Android devices." },
        { item: "The app provides MFA approval notifications and Number Matching verification." },
        { item: "It can provide one-time passcodes, passwordless sign-in support and secure account verification." },
        { item: "Many organisations require Microsoft Authenticator as part of their Microsoft 365 security policies." },
      ],
    },
    {
      title: "Why Is Microsoft Authenticator Important?",
      checklist: [
        { item: "Passwords can be stolen through phishing attacks, malware, credential theft and data breaches." },
        { item: "Microsoft Authenticator requires approval from your trusted mobile device." },
        { item: "Even if someone discovers your password, they cannot access your account without completing MFA verification." },
      ],
    },
    {
      title: "Download Microsoft Authenticator",
      checklist: [
        { item: "iPhone: open the App Store, search for Microsoft Authenticator, select Install and open the application." },
        { item: "Android: open Google Play Store, search for Microsoft Authenticator, select Install and open the application." },
        { item: "Only install the official Microsoft Authenticator application." },
      ],
    },
    {
      title: "Understanding Number Matching",
      checklist: [
        { item: "A number appears on your computer when signing in." },
        { item: "The same number appears within Microsoft Authenticator." },
        { item: "Enter the matching number and approve the request." },
        { item: "Number Matching helps prevent accidental approval of fraudulent login attempts." },
      ],
    },
    {
      title: "How to Approve Future Sign-In Requests",
      checklist: [
        { item: "Enter your username and password." },
        { item: "Review the approval request on your phone." },
        { item: "Verify the sign-in details." },
        { item: "Approve the request only if you initiated the sign-in." },
        { item: "Contact your IT support team immediately if you receive unexpected approval prompts." },
      ],
    },
    {
      title: "Managing Your Authentication Methods",
      checklist: [
        { item: "Visit mysignins.microsoft.com/security-info to manage security information." },
        { item: "Add new devices." },
        { item: "Remove old devices." },
        { item: "Update phone numbers." },
        { item: "Add backup authentication methods." },
        { item: "Change default verification methods." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "You changed phones." },
        { item: "You cannot scan the QR code." },
        { item: "MFA notifications are not arriving." },
        { item: "The app is not working correctly." },
        { item: "You cannot access your account." },
        { item: "You need your MFA method reset." },
        { item: "Providing screenshots of any error messages will assist with faster troubleshooting." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "QR Code Will Not Scan",
      content:
        "Increase screen brightness, clean your camera lens, enlarge the browser window and restart Microsoft Authenticator.",
    },
    {
      title: "No Approval Notifications Received",
      content:
        "Check mobile internet connectivity, notification permissions, battery optimisation settings and Authenticator app updates. You can also open the app manually and check for pending requests.",
    },
    {
      title: "New Mobile Device",
      content:
        "Reinstall Microsoft Authenticator, re-register your account, remove old devices if required and contact support if you are unable to sign in.",
    },
    {
      title: "Authenticator App Not Working",
      content:
        "Update the application, restart your phone, remove and re-add the account and verify notification permissions. If problems continue, contact support.",
    },
  ],
  bestPracticeTips: [
    { title: "Never approve unexpected requests", icon: "shield-check" },
    { title: "Keep the application updated", icon: "check-circle" },
    { title: "Register backup authentication methods", icon: "lock" },
    {
      title: "Protect your mobile device",
      body: "Use a PIN, passcode or biometric security on your phone.",
      icon: "smartphone",
    },
    { title: "Report suspicious login activity immediately", icon: "shield-alert" },
    {
      title: "Treat unexpected prompts as suspicious",
      body: "Unexpected MFA prompts may indicate an attempted account compromise.",
      icon: "info",
    },
  ],
  faqs: [
    {
      question: "Is Microsoft Authenticator free?",
      answer:
        "Yes. Microsoft Authenticator is available free of charge for iOS and Android devices.",
    },
    {
      question: "Can I use Microsoft Authenticator on multiple devices?",
      answer:
        "Many organisations allow multiple devices, subject to company policy.",
    },
    {
      question: "What happens if I lose my phone?",
      answer:
        "Contact your IT support team to reset your MFA registration and restore account access.",
    },
    {
      question: "Can I use SMS instead?",
      answer:
        "This depends on your organisation's security policies. Many businesses prefer Microsoft Authenticator for stronger security.",
    },
    {
      question: "Why am I being asked to enter a number?",
      answer:
        "Microsoft uses Number Matching to protect against MFA fatigue and approval attacks.",
    },
  ],
};

const passwordResetContent = lexicalBlocks([
  paragraphNode(
    "Your Microsoft 365 password protects access to important business services including Outlook, Microsoft Teams, OneDrive, SharePoint and other Microsoft applications."
  ),
  paragraphNode(
    "There may be times when you need to reset your password because it has been forgotten, expired, or you suspect it may have been compromised."
  ),
  paragraphNode(
    "This guide explains how to safely reset your Microsoft 365 password, complete identity verification and update your devices after a password change."
  ),
  headingNode("When Should You Reset Your Password?"),
  paragraphNode("You should reset your password if any of the following apply."),
  listNode([
    "You have forgotten your password.",
    "Your password has expired.",
    "You receive a password expiry notification.",
    "You suspect someone else knows your password.",
    "You entered your password into a suspicious website.",
    "You notice unusual account activity.",
    "Your organisation requires a password change.",
  ]),
  paragraphNode(
    "Resetting your password promptly can help protect your account and business data."
  ),
  headingNode("Before You Start"),
  listNode([
    "Confirm your Microsoft 365 email address.",
    "Ensure you have access to your registered MFA method.",
    "Have access to your mobile phone if MFA is enabled.",
    "Ensure you can receive verification notifications.",
    "Choose a strong new password.",
  ]),
  headingNode("Password Requirements"),
  paragraphNode("Most organisations require passwords that meet minimum security standards."),
  listNode([
    "Contain at least 12 characters.",
    "Include uppercase letters.",
    "Include lowercase letters.",
    "Include numbers.",
    "Include special characters.",
    "Are not based on personal information.",
  ]),
  paragraphNode(
    "Avoid reusing old passwords, using the same password on multiple services or sharing passwords with other users."
  ),
  headingNode("How to Reset Your Password"),
  listNode(
    [
      "Open the Microsoft password reset page.",
      "Enter your Microsoft 365 email address.",
      "Complete the CAPTCHA verification if prompted.",
      "Verify your identity using the method requested by your organisation.",
      "Create and confirm a new password.",
      "Sign back into Microsoft 365 and update saved passwords on your devices.",
    ],
    "number",
  ),
  headingNode("Update Saved Passwords on Your Devices"),
  paragraphNode(
    "After a password reset, devices may continue attempting to use the old password. Update Outlook Desktop, Microsoft Teams, mobile devices and OneDrive when prompted."
  ),
  headingNode("What To Do If Your Password Was Stolen"),
  paragraphNode(
    "If you believe your password was entered into a phishing website or disclosed to another party, reset your password immediately, review recent account activity, notify your IT support team, review MFA settings, sign out of active sessions if required and monitor for unusual activity."
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if you cannot complete verification, your account is locked, MFA is unavailable, you suspect account compromise, password resets continue to fail or you entered your password into a suspicious website."
  ),
]);

const passwordResetGuideLayout = {
  enabled: true,
  overview:
    "Your Microsoft 365 password protects access to important business services including Outlook, Microsoft Teams, OneDrive, SharePoint and other Microsoft applications. There may be times when you need to reset your password because it has been forgotten, expired, or you suspect it may have been compromised. This guide explains how to safely reset your Microsoft 365 password, complete identity verification and update your devices after a password change.",
  beforeYouStart: [
    { item: "Confirm your Microsoft 365 email address." },
    { item: "Ensure you have access to your registered MFA method." },
    { item: "Have access to your mobile phone if MFA is enabled." },
    { item: "Ensure you can receive verification notifications." },
    { item: "Choose a strong new password." },
  ],
  beforeYouStartCallout:
    "If you no longer have access to your registered MFA method or security information, contact your IT support team before starting the password reset process.",
  steps: [
    {
      title: "Option 1: Self-Service Password Reset",
      intro:
        "Use Microsoft self-service password reset when your organisation has enabled it for your account.",
      checklist: [
        { item: "Open the Microsoft password reset page." },
        { item: "Enter your Microsoft 365 email address." },
        { item: "Complete the CAPTCHA verification if prompted." },
        { item: "Select Next." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft password reset page",
        icon: "lock",
      },
      callout: {
        type: "info",
        body: "Microsoft will begin the verification process after you submit your account details.",
      },
    },
    {
      title: "Step 1: Verify Your Identity",
      intro:
        "Depending on your organisation's configuration, you may be asked to verify your identity before changing your password.",
      checklist: [
        { item: "Approve the request in Microsoft Authenticator." },
        { item: "Enter an SMS verification code if prompted." },
        { item: "Complete phone call verification if required." },
        { item: "Use an alternate email address if that method is configured." },
      ],
      infoCards: [
        {
          title: "Authenticator approval",
          body: "Use your registered Microsoft Authenticator app when available.",
          icon: "shield-check",
        },
        {
          title: "Backup methods",
          body: "SMS, phone call or alternate email may be available depending on policy.",
          icon: "phone",
        },
      ],
    },
    {
      title: "Step 2: Create a New Password",
      intro:
        "Once verification is successful, create a strong password that is not used on any other service.",
      checklist: [
        { item: "Enter a new password." },
        { item: "Confirm the new password." },
        { item: "Submit the password change." },
        {
          item: "Wait for Microsoft to confirm the password reset has completed successfully.",
        },
      ],
      callout: {
        type: "warning",
        body: "Do not reuse old passwords or passwords used on personal accounts.",
      },
    },
    {
      title: "Step 3: Sign Back In",
      intro:
        "After resetting your password, sign back into your Microsoft 365 services and confirm everything opens correctly.",
      checklist: [
        { item: "Sign back into Microsoft 365." },
        { item: "Open Outlook." },
        { item: "Open Teams." },
        { item: "Access OneDrive." },
        { item: "Verify access to business applications." },
      ],
      callout: {
        type: "info",
        body: "You may be prompted to enter the new password multiple times across different applications.",
      },
    },
  ],
  extraSections: [
    {
      title: "When Should You Reset Your Password?",
      checklist: [
        { item: "You have forgotten your password." },
        { item: "Your password has expired." },
        { item: "You receive a password expiry notification." },
        { item: "You suspect someone else knows your password." },
        { item: "You entered your password into a suspicious website." },
        { item: "You notice unusual account activity." },
        { item: "Your organisation requires a password change." },
        {
          item: "Resetting your password promptly can help protect your account and business data.",
        },
      ],
    },
    {
      title: "Password Requirements",
      checklist: [
        { item: "Use at least 12 characters where required by policy." },
        { item: "Include uppercase letters, lowercase letters, numbers and special characters." },
        { item: "Avoid passwords based on personal information." },
        { item: "Do not reuse old passwords." },
        { item: "Do not use the same password on multiple services." },
        { item: "Do not share passwords with other users." },
      ],
    },
    {
      title: "Update Saved Passwords on Your Devices",
      checklist: [
        {
          item: "Outlook Desktop: remove any prompts using the old password and enter your new password when requested.",
        },
        { item: "Microsoft Teams: sign out and sign back in using your new password." },
        { item: "Mobile Devices: update account settings on iPhone, iPad and Android devices." },
        { item: "OneDrive: reconnect or reauthenticate if prompted." },
      ],
    },
    {
      title: "What If You Forgot Your MFA Device?",
      checklist: [
        { item: "Contact your IT support team." },
        { item: "Request an MFA reset." },
        { item: "Complete identity verification requirements." },
        {
          item: "Support staff may need to reset your security information before you can regain access.",
        },
      ],
    },
    {
      title: "What If Your Account Is Locked?",
      checklist: [
        { item: "Accounts may lock after multiple failed sign-in attempts." },
        { item: "Security policies or suspicious login activity may also trigger a lock." },
        {
          item: "If your account remains locked after waiting several minutes, contact support for assistance.",
        },
      ],
    },
    {
      title: "What To Do If Your Password Was Stolen",
      checklist: [
        { item: "Reset your password immediately." },
        { item: "Review recent account activity." },
        { item: "Notify your IT support team." },
        { item: "Review MFA settings." },
        { item: "Sign out of active sessions if required." },
        { item: "Monitor for unusual activity." },
        { item: "Do not wait to see if problems occur." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "You cannot complete verification." },
        { item: "Your account is locked." },
        { item: "MFA is unavailable." },
        { item: "You suspect account compromise." },
        { item: "Password resets continue to fail." },
        { item: "You entered your password into a suspicious website." },
        {
          item: "Providing screenshots of any error messages will assist with faster troubleshooting.",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Verification Code Not Received",
      content:
        "Check mobile reception, spam or junk folders, notification permissions and whether your registered contact information is correct.",
    },
    {
      title: "Password Reset Loop",
      content:
        "Clear your browser cache, use a private browsing window, try another browser or restart your device before attempting the reset again.",
    },
    {
      title: "Unable to Sign In After Reset",
      content:
        "Verify the email address is correct, confirm you are using the new password, update credentials on devices and complete any MFA approval prompts.",
    },
  ],
  bestPracticeTips: [
    { title: "Use a unique password", icon: "lock" },
    { title: "Enable Multi-Factor Authentication", icon: "shield-check" },
    { title: "Never share passwords", icon: "shield-alert" },
    {
      title: "Avoid unsecured password storage",
      body: "Do not store passwords in unsecured documents, notes or spreadsheets.",
      icon: "lock",
    },
    {
      title: "Use a reputable password manager",
      body: "A password manager can help create and store strong unique passwords.",
      icon: "shield-check",
    },
    { title: "Report suspicious activity immediately", icon: "info" },
  ],
  faqs: [
    {
      question: "How often should I change my password?",
      answer:
        "Follow your organisation's password policy. Frequent changes may not always be required if strong passwords and MFA are in place.",
    },
    {
      question: "Will resetting my password delete my emails?",
      answer:
        "No. Resetting your password does not affect mailbox contents or Microsoft 365 data.",
    },
    {
      question: "Why am I still being prompted for my old password?",
      answer:
        "Some applications or devices may still be using cached credentials and need to be updated.",
    },
    {
      question: "Can I reset my password without MFA?",
      answer:
        "This depends on your organisation's security settings and identity verification requirements.",
    },
    {
      question: "What if I cannot access any verification methods?",
      answer:
        "You will need assistance from your IT support team to regain access.",
    },
  ],
};

const phishingGuideLayout = {
  enabled: true,
  overview:
    "Phishing emails are fraudulent messages designed to trick recipients into revealing passwords, financial information, business data or other sensitive information. Cybercriminals often impersonate trusted organisations, colleagues, suppliers or Microsoft 365 services to make their messages appear legitimate. Knowing how to identify and respond to phishing emails is one of the most effective ways to protect both your organisation and your personal information. This guide explains how to recognise phishing attempts, what actions to take, and when to contact your IT support team.",
  beforeYouStart: [
    { item: "Do not click links, open attachments or reply if a message looks suspicious." },
    { item: "Keep the suspicious email available until it has been reported." },
    { item: "Use official contact channels if you need to verify a sender or request." },
    { item: "Contact Genisys Support immediately if you clicked a link or entered credentials." },
  ],
  beforeYouStartCallout:
    "Prompt reporting significantly reduces the risk of account compromise and helps protect other users in your organisation.",
  steps: [
    {
      title: "Step 1: Do Not Click Any Links",
      intro:
        "If you suspect an email may be malicious, avoid interacting with it until it has been reviewed or reported.",
      checklist: [
        { item: "Do not click links." },
        { item: "Do not open attachments." },
        { item: "Do not reply to the sender." },
        { item: "Do not provide personal information." },
      ],
      callout: {
        type: "warning",
        body: "Even opening an attachment can sometimes trigger malicious activity.",
      },
    },
    {
      title: "Step 2: Verify the Sender",
      intro:
        "Before taking any action, check whether the message really came from the person or organisation it claims to represent.",
      checklist: [
        { item: "Review the sender's email address." },
        { item: "Check for unusual spelling." },
        { item: "Compare the address with previous legitimate emails." },
        { item: "Be cautious of addresses that appear similar but are not exact matches." },
      ],
      infoCards: [
        {
          title: "Legitimate example",
          body: "john.smith@company.com",
          icon: "check-circle",
        },
        {
          title: "Suspicious example",
          body: "john.smith-company@outlook.com",
          icon: "shield-alert",
        },
      ],
    },
    {
      title: "Step 3: Report the Email",
      intro:
        "Reporting phishing emails helps your IT team investigate the message and prevent other users from becoming victims.",
      checklist: [
        { item: "Select the suspicious email." },
        { item: "Click Report Message." },
        { item: "Choose Phishing." },
        { item: "Submit the report." },
      ],
      callout: {
        type: "info",
        body: "If the reporting option is unavailable, forward the email to your IT team and include a note explaining why you believe it is suspicious.",
      },
    },
    {
      title: "Step 4: Delete the Email",
      intro:
        "Once the suspicious email has been reported, remove it from your mailbox unless your IT team asks you to keep it.",
      checklist: [
        { item: "Delete the message." },
        { item: "Empty Deleted Items if instructed by IT." },
        { item: "Avoid interacting with the message further." },
      ],
    },
  ],
  extraSections: [
    {
      title: "What Is a Phishing Email?",
      checklist: [
        { item: "Steal usernames and passwords." },
        { item: "Obtain banking or payment information." },
        { item: "Deliver malware or ransomware." },
        { item: "Gain access to company systems." },
        { item: "Trick users into transferring money." },
        { item: "Harvest personal information." },
        {
          item: "Modern phishing attacks may closely resemble genuine communications from Microsoft, banks, suppliers, couriers or internal staff.",
        },
      ],
    },
    {
      title: "Common Signs of a Phishing Email",
      checklist: [
        { item: "Unexpected attachments." },
        { item: "Requests for passwords." },
        { item: "Urgent or threatening language." },
        { item: "Unusual payment requests." },
        { item: "Links to unfamiliar websites." },
        { item: "Poor spelling or grammar." },
        { item: "Unexpected login prompts." },
        { item: "Messages claiming your account will be suspended." },
        { item: "Example: Your Microsoft 365 account will be disabled today." },
        { item: "Example: Invoice overdue - immediate payment required." },
        { item: "Example: Click here to verify your mailbox." },
        { item: "Example: Your package could not be delivered." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "You clicked a suspicious link." },
        { item: "You opened a suspicious attachment." },
        { item: "You entered credentials into a website." },
        { item: "You believe your account may be compromised." },
        { item: "You notice unusual account activity." },
        {
          item: "The sooner a phishing incident is reported, the faster potential risks can be contained.",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "What if I clicked a suspicious link?",
      content:
        "Disconnect from the internet if advised by IT, notify your IT support team immediately, provide the email details, monitor for unusual account activity and follow any instructions provided by support staff.",
    },
    {
      title: "What if I entered my password?",
      content:
        "Change your password immediately, change passwords on any other systems using the same password, notify IT support, reset Multi-Factor Authentication if instructed and monitor account activity. Do not wait to see if anything happens.",
    },
    {
      title: "Can phishing happen on mobile devices?",
      content:
        "Yes. Phishing attempts can occur through mobile email apps, SMS messages, Microsoft Teams messages and social media platforms. Avoid unknown links, verify senders and report suspicious activity.",
    },
  ],
  bestPracticeTips: [
    { title: "Use Multi-Factor Authentication", icon: "shield-check" },
    { title: "Keep devices updated", icon: "check-circle" },
    { title: "Verify unexpected requests", icon: "info" },
    { title: "Avoid password reuse", icon: "lock" },
    { title: "Report suspicious emails immediately", icon: "headphones" },
    { title: "Complete security awareness training", icon: "book-open" },
  ],
  faqs: [
    {
      question: "Can I get a virus just by opening an email?",
      answer:
        "Most modern email platforms block malicious content, but attachments and links remain a significant risk.",
    },
    {
      question: "Should I reply to verify the sender?",
      answer:
        "No. Contact the organisation through official channels instead.",
    },
    {
      question: "What happens after I report a phishing email?",
      answer:
        "Your IT team may investigate the message, block the sender and remove similar emails from other mailboxes.",
    },
    {
      question: "Why do phishing emails look so convincing?",
      answer:
        "Cybercriminals frequently copy logos, branding and formatting from legitimate organisations to gain trust.",
    },
  ],
};

const mfaGuideLayout = {
  enabled: true,
  beforeYouStart: [
    { item: "Make sure you have access to your Genisys-managed Microsoft 365 account." },
    { item: "Have your mobile phone available." },
    { item: "Install the Microsoft Authenticator app if required." },
    { item: "Allow 5-10 minutes to complete the setup." },
  ],
  steps: [
    {
      title: "Step 1: Sign in to Microsoft 365",
      checklist: [
        { item: "Go to the Microsoft 365 sign-in page." },
        { item: "Enter your work email address and password." },
        { item: "Follow the prompt asking for additional security information." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft 365 sign-in screen",
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
        { item: "Open the Microsoft Authenticator app." },
        { item: "Tap Add account." },
        { item: "Select Work or school account." },
        { item: "Scan the QR code shown on your computer screen." },
        { item: "Approve the test notification." },
      ],
      infoCards: [
        {
          title: "Keep the setup window open",
          body: "You will need to scan the QR code shown on your computer.",
          icon: "monitor",
        },
        {
          title: "Approve the test prompt",
          body: "This confirms the app is linked to your Microsoft 365 account.",
          icon: "check-circle",
        },
      ],
    },
    {
      title: "Step 4: Confirm MFA Is Working",
      checklist: [
        { item: "Sign out of Microsoft 365." },
        { item: "Sign back in." },
        { item: "Confirm you receive an MFA prompt." },
        { item: "Approve the sign-in request." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "I changed phones",
      content:
        "Use your existing verified method to sign in, then update your Microsoft 365 security information with the new device. If you cannot access the old phone, create a support ticket.",
    },
    {
      title: "I am not receiving prompts",
      content:
        "Check that notifications are enabled for Microsoft Authenticator, your phone has network access and the app is up to date.",
    },
    {
      title: "I lost access to my authenticator app",
      content:
        "Contact Genisys support so your verification method can be reset after your identity is confirmed.",
    },
    {
      title: "I am travelling overseas",
      content:
        "Use the Microsoft Authenticator app over Wi-Fi where possible. SMS delivery may vary depending on roaming and carrier restrictions.",
    },
    {
      title: "I need to update my verification method",
      content:
        "Sign in to Microsoft 365 security information and add or remove verification methods. Keep at least one backup method available.",
    },
  ],
  bestPracticeTips: [
    { title: "Never approve unexpected MFA prompts", icon: "shield-check" },
    { title: "Report suspicious sign-in requests", icon: "shield-check" },
    { title: "Keep your mobile device secure", icon: "shield-check" },
    { title: "Use strong, unique passwords", icon: "shield-check" },
    { title: "Contact support if something feels wrong", icon: "shield-check" },
  ],
};

const mfaRegistrationArticleContent = lexicalBlocks([
  paragraphNode(
    "Microsoft continues to enhance account security by introducing updated Multi-Factor Authentication (MFA) registration and sign-in experiences across Microsoft 365 services."
  ),
  paragraphNode(
    "If your organisation has recently enabled MFA or adopted Microsoft's Security Defaults or Conditional Access policies, you may be prompted to complete a new registration process when signing in."
  ),
  paragraphNode(
    "This guide explains what has changed, what to expect during registration, and how to successfully complete the setup process."
  ),
  headingNode("Why Is Microsoft Requiring MFA?"),
  paragraphNode(
    "Passwords alone are no longer sufficient to protect business accounts from modern cyber threats. Even if a password is stolen, MFA helps ensure attackers cannot access your account."
  ),
  listNode([
    "Account compromise.",
    "Credential theft.",
    "Phishing attacks.",
    "Unauthorised access.",
    "Business email compromise.",
  ]),
  headingNode("What Has Changed?"),
  paragraphNode(
    "Microsoft's updated registration process provides a streamlined setup experience, encourages Microsoft Authenticator, supports multiple authentication methods and improves account recovery options."
  ),
  listNode([
    "Outlook.",
    "Microsoft Teams.",
    "OneDrive.",
    "SharePoint.",
    "Microsoft 365 Portal.",
    "Office applications.",
  ]),
  headingNode("Before You Begin"),
  listNode([
    "Your Microsoft 365 username and password.",
    "A smartphone or mobile device.",
    "Access to the Apple App Store or Google Play Store.",
    "Internet connectivity.",
    "Your work email account.",
  ]),
  headingNode("Step 1: Sign In to Microsoft 365"),
  listNode(
    [
      "Open the Microsoft 365 sign-in page.",
      "Enter your work email address.",
      "Enter your password.",
      "Click Sign In.",
      "Select Next if additional security information is required.",
    ],
    "number",
  ),
  headingNode("Step 2: Choose an Authentication Method"),
  paragraphNode(
    "Microsoft will present available verification methods. For most users, Microsoft Authenticator is recommended."
  ),
  listNode([
    "Microsoft Authenticator App.",
    "SMS Verification.",
    "Phone Call Verification.",
    "Security Key.",
  ]),
  headingNode("Step 3: Install Microsoft Authenticator"),
  listNode(
    [
      "Open the App Store or Google Play Store.",
      "Search for Microsoft Authenticator.",
      "Install the application.",
      "Open the app after installation.",
    ],
    "number",
  ),
  headingNode("Step 4: Register Your Account"),
  listNode(
    [
      "Select Microsoft Authenticator in the registration screen.",
      "Click Next.",
      "Open Microsoft Authenticator.",
      "Tap Add Account.",
      "Select Work or School Account.",
      "Choose Scan QR Code and scan the displayed QR code.",
    ],
    "number",
  ),
  headingNode("Step 5: Complete Verification"),
  listNode(
    [
      "Approve the test notification in Microsoft Authenticator.",
      "Enter any displayed matching number if prompted.",
      "Complete verification.",
      "Confirm registration has been finalised.",
    ],
    "number",
  ),
  headingNode("Step 6: Add Additional Verification Methods"),
  paragraphNode(
    "Backup methods help ensure account access if your primary device is unavailable."
  ),
  listNode([
    "Mobile phone number.",
    "Alternate email address.",
    "Secondary authentication method.",
  ]),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if registration fails repeatedly, you cannot access Microsoft Authenticator, you have replaced your mobile device, MFA notifications are not received, you are locked out of your account or you suspect suspicious account activity."
  ),
]);

const mfaRegistrationGuideLayout = {
  enabled: true,
  overview:
    "Microsoft continues to enhance account security by introducing updated Multi-Factor Authentication (MFA) registration and sign-in experiences across Microsoft 365 services. If your organisation has recently enabled MFA or adopted Microsoft's Security Defaults or Conditional Access policies, you may be prompted to complete a new registration process when signing in. This guide explains what has changed, what to expect during registration, and how to successfully complete the setup process.",
  beforeYouStart: [
    { item: "Have your Microsoft 365 username and password ready." },
    { item: "Use a smartphone or mobile device for Microsoft Authenticator." },
    { item: "Confirm you can access the Apple App Store or Google Play Store." },
    { item: "Make sure you have internet connectivity and access to your work email account." },
  ],
  beforeYouStartCallout:
    "Most organisations recommend using Microsoft Authenticator because it provides stronger protection than SMS or phone call verification.",
  steps: [
    {
      title: "Step 1: Sign In to Microsoft 365",
      intro:
        "Start from the Microsoft 365 sign-in page and follow the prompt for additional security information.",
      checklist: [
        { item: "Open the Microsoft 365 sign-in page." },
        { item: "Enter your work email address." },
        { item: "Enter your password." },
        { item: "Click Sign In." },
        { item: "Select Next if a message advises that additional security information is required." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft 365 additional security information prompt",
        icon: "monitor",
      },
    },
    {
      title: "Step 2: Choose an Authentication Method",
      intro:
        "Microsoft will show the verification methods available under your organisation's policy.",
      checklist: [
        { item: "Review the available authentication methods." },
        { item: "Choose Microsoft Authenticator App where available." },
        { item: "Use SMS, phone call verification or a security key only if approved by your organisation." },
      ],
      infoCards: [
        {
          title: "Recommended method",
          body: "Microsoft Authenticator app.",
          icon: "shield-check",
        },
        {
          title: "Alternative methods",
          body: "SMS verification, phone call verification or security key.",
          icon: "phone",
        },
      ],
    },
    {
      title: "Step 3: Install Microsoft Authenticator",
      intro:
        "Install the official Microsoft Authenticator app before scanning the registration QR code.",
      checklist: [
        { item: "Open the App Store or Google Play Store." },
        { item: "Search for Microsoft Authenticator." },
        { item: "Install the application." },
        { item: "Open the app after installation." },
      ],
      callout: {
        type: "warning",
        body: "Do not install unofficial authentication applications unless instructed by your IT team.",
      },
    },
    {
      title: "Step 4: Register Your Account",
      intro:
        "Connect your Microsoft 365 account to Microsoft Authenticator using the QR code shown in the registration screen.",
      checklist: [
        { item: "Select Microsoft Authenticator." },
        { item: "Click Next." },
        { item: "Wait for the QR code to appear." },
        { item: "In Microsoft Authenticator, tap Add Account." },
        { item: "Select Work or School Account." },
        { item: "Choose Scan QR Code and scan the displayed QR code." },
      ],
      infoCards: [
        {
          title: "Keep the setup page open",
          body: "The QR code needs to stay visible until the mobile app scans it successfully.",
          icon: "monitor",
        },
        {
          title: "Use work or school account",
          body: "This links the app to your Microsoft 365 work account.",
          icon: "mail",
        },
      ],
    },
    {
      title: "Step 5: Complete Verification",
      intro:
        "Microsoft sends a test notification to confirm the app is correctly registered.",
      checklist: [
        { item: "Approve the request in Microsoft Authenticator." },
        { item: "Enter any displayed matching number if prompted." },
        { item: "Complete verification." },
        { item: "Confirm registration has been finalised." },
      ],
      callout: {
        type: "info",
        body: "Once verification succeeds, Microsoft 365 will use the registered method for future MFA prompts.",
      },
    },
    {
      title: "Step 6: Add Additional Verification Methods",
      intro:
        "Microsoft may recommend backup authentication methods so you can recover access if your primary device is unavailable.",
      checklist: [
        { item: "Add a mobile phone number if permitted." },
        { item: "Add an alternate email address where supported." },
        { item: "Register a secondary authentication method if company policy allows it." },
        { item: "Keep backup methods current when phone numbers or devices change." },
      ],
    },
  ],
  extraSections: [
    {
      title: "Why Is Microsoft Requiring MFA?",
      checklist: [
        { item: "Passwords alone are no longer sufficient to protect business accounts from modern cyber threats." },
        { item: "MFA helps prevent account compromise and credential theft." },
        { item: "MFA helps reduce phishing, unauthorised access and business email compromise risk." },
        { item: "Even if a password is stolen, MFA helps ensure attackers cannot access your account." },
      ],
    },
    {
      title: "What Has Changed?",
      checklist: [
        { item: "Microsoft's updated registration process provides a streamlined setup experience." },
        { item: "The process encourages use of the Microsoft Authenticator app." },
        { item: "Multiple authentication methods and account recovery options may be supported." },
        { item: "Users may notice new registration screens in Outlook, Teams, OneDrive, SharePoint, the Microsoft 365 Portal and Office applications." },
      ],
    },
    {
      title: "Understanding Number Matching",
      checklist: [
        { item: "A number appears on the Microsoft 365 sign-in screen." },
        { item: "The same number must be entered into Microsoft Authenticator." },
        { item: "Access is granted after successful verification." },
        { item: "Number Matching provides stronger protection against MFA fatigue attacks." },
      ],
    },
    {
      title: "Managing Your Security Information",
      checklist: [
        { item: "Visit https://mysignins.microsoft.com/security-info to review or update authentication methods." },
        { item: "Add authentication methods." },
        { item: "Remove old devices." },
        { item: "Update phone numbers." },
        { item: "Change default sign-in methods." },
        { item: "Review registered devices." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "Registration fails repeatedly." },
        { item: "You cannot access Microsoft Authenticator." },
        { item: "You have replaced your mobile device." },
        { item: "MFA notifications are not received." },
        { item: "You are locked out of your account." },
        { item: "You suspect suspicious account activity." },
        { item: "Providing screenshots of any error messages will assist with faster troubleshooting." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "QR Code Will Not Scan",
      content:
        "Increase screen brightness, clean your camera lens, restart Microsoft Authenticator and reopen the registration page.",
    },
    {
      title: "No Approval Notification Received",
      content:
        "Check mobile internet, notification permissions, Authenticator app updates and device battery optimisation settings. You can also open the Authenticator app directly.",
    },
    {
      title: "New Phone or Device",
      content:
        "Re-register Microsoft Authenticator, remove old devices if required and contact your IT team if access is unavailable.",
    },
    {
      title: "Registration Loop",
      content:
        "Sign out completely, clear browser cache, restart the browser and attempt registration again. If the issue persists, contact support.",
    },
  ],
  bestPracticeTips: [
    { title: "Never approve unexpected MFA requests", icon: "shield-check" },
    { title: "Report suspicious prompts immediately", icon: "shield-alert" },
    { title: "Keep Microsoft Authenticator updated", icon: "check-circle" },
    { title: "Register backup authentication methods", icon: "lock" },
    { title: "Review security information regularly", icon: "clock" },
    {
      title: "Treat unexpected prompts as suspicious",
      body: "Unexpected MFA requests may indicate someone is attempting to access your account.",
      icon: "info",
    },
  ],
  faqs: [
    {
      question: "Is MFA mandatory?",
      answer:
        "Many organisations require MFA to protect business systems and sensitive information.",
    },
    {
      question: "Can I use a different authenticator app?",
      answer:
        "This depends on your organisation's policies. Microsoft Authenticator is generally recommended.",
    },
    {
      question: "What happens if I lose my phone?",
      answer:
        "Contact your IT support team. They can help restore access and reset authentication methods if required.",
    },
    {
      question: "Why am I being asked to enter a number?",
      answer:
        "Microsoft uses Number Matching to improve security and prevent accidental approval of malicious login requests.",
    },
    {
      question: "Can I use MFA on multiple devices?",
      answer:
        "Many organisations allow additional devices to be registered, subject to company policy.",
    },
  ],
};

const teamsCallingGuideLayout = {
  enabled: true,
  beforeYouStart: [
    { item: "Ensure your Teams Calling account has been provisioned by Genisys." },
    { item: "Confirm you are signed into Microsoft Teams." },
    { item: "Ensure your headset or microphone is connected." },
    { item: "Internet connection required." },
  ],
  beforeYouStartCallout:
    "If you are unsure whether Teams Calling has been enabled for your account, contact the Genisys support team.",
  steps: [
    {
      title: "Step 1: Open Microsoft Teams",
      checklist: [
        { item: "Launch Microsoft Teams on desktop or mobile." },
        { item: "Sign in using your Microsoft 365 work account." },
        { item: "Select the Calls tab from the left navigation menu." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft Teams Calls menu",
        icon: "phone",
      },
    },
    {
      title: "Step 2: Make a Call",
      checklist: [
        { item: "Select Calls." },
        { item: "Enter a name or phone number." },
        { item: "Click the Call button." },
        { item: "Use the dial pad for external numbers if enabled." },
      ],
      infoCards: [
        { title: "Internal extension dialling", icon: "phone" },
        { title: "External numbers", icon: "phone" },
        { title: "Recent call history", icon: "phone" },
      ],
    },
    {
      title: "Step 3: Answer and Manage Calls",
      intro: "Incoming calls appear within Teams.",
      checklist: [
        { item: "Answer" },
        { item: "Decline" },
        { item: "Hold" },
        { item: "Transfer" },
        { item: "Mute" },
      ],
      infoCards: [
        { title: "Hold", icon: "clock" },
        { title: "Transfer", icon: "arrow-right" },
        { title: "Mute", icon: "x" },
        { title: "Speaker", icon: "headphones" },
        { title: "Keypad", icon: "grid-2x2" },
      ],
    },
    {
      title: "Step 4: Access Voicemail",
      checklist: [
        { item: "Open the Calls tab." },
        { item: "Select Voicemail." },
        { item: "Listen to messages directly within Teams." },
        { item: "Read voicemail transcription where available." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Teams voicemail interface",
        icon: "message-circle",
      },
    },
    {
      title: "Step 5: Configure Audio Devices",
      checklist: [
        { item: "Open Teams Settings." },
        { item: "Navigate to Devices." },
        { item: "Select your preferred speaker, microphone and headset." },
        { item: "Run a test call." },
      ],
      callout: {
        type: "info",
        body: "Using a certified Teams headset can significantly improve call quality.",
      },
    },
  ],
  extraSections: [
    {
      title: "Mobile Teams Calling",
      checklist: [
        { item: "Download Microsoft Teams mobile app." },
        { item: "Sign in with work account." },
        { item: "Allow microphone and notification permissions." },
        { item: "Calls can be answered directly from mobile." },
      ],
      featureCard: {
        enabled: true,
        title: "Teams Calling on mobile",
        body: "App-style visual placeholder for answering Teams calls from a mobile device.",
        icon: "smartphone",
      },
    },
  ],
  troubleshooting: [
    {
      title: "I cannot see the Calls tab",
      content:
        "Your Teams Calling licence or policy may not be enabled. Contact Genisys support so we can confirm your account configuration.",
    },
    {
      title: "My microphone or speaker is not working",
      content:
        "Open Teams device settings, select the correct speaker and microphone, then run a test call. Check your browser or operating system permissions if the issue continues.",
    },
    {
      title: "Calls are dropping or audio is poor",
      content:
        "Move to a stronger network connection, close bandwidth-heavy apps and try a certified headset. If the issue affects multiple users, raise a support ticket.",
    },
    {
      title: "I cannot call external numbers",
      content:
        "External dialling must be enabled for your account. Contact Genisys support if your calling plan or permissions need to be checked.",
    },
  ],
  bestPracticeTips: [
    { title: "Use wired or certified headsets", icon: "headphones" },
    { title: "Avoid public Wi-Fi where possible", icon: "wifi" },
    { title: "Keep Teams updated", icon: "check-circle" },
    { title: "Use quiet environments for calls", icon: "message-circle" },
    { title: "Restart Teams if audio issues occur", icon: "monitor" },
  ],
};

const teamsCallingMigrationContent = lexicalBlocks([
  paragraphNode(
    "Your organisation is migrating to Microsoft Teams Calling to provide a modern cloud-based phone system that integrates directly with Microsoft Teams."
  ),
  paragraphNode(
    "This migration allows users to make and receive external phone calls using Teams while benefiting from improved flexibility, mobility and collaboration features."
  ),
  paragraphNode(
    "This article explains what is changing, when the migration is occurring, what users can expect, and what actions may be required before and after the transition."
  ),
  headingNode("What Is Teams Calling?"),
  paragraphNode("Microsoft Teams Calling enables users to:"),
  listNode([
    "Make and receive external phone calls.",
    "Use a business phone number within Teams.",
    "Transfer and forward calls.",
    "Access voicemail.",
    "Use desktop, mobile and headset devices.",
    "Work from anywhere with an internet connection.",
  ]),
  paragraphNode(
    "Teams Calling replaces traditional desk phone systems with a cloud-based voice platform."
  ),
  headingNode("What Is Changing?"),
  listNode([
    "Phone services will move into Microsoft Teams.",
    "Existing business phone numbers will be migrated.",
    "Voicemail services will be managed through Teams.",
    "Call history will be available within Teams.",
    "Some desk phones may be replaced or reconfigured.",
    "Call handling settings may be updated.",
  ]),
  headingNode("Migration Timeline"),
  paragraphNode(
    "The migration process generally includes preparation before migration, phone number porting and service activation during migration, then validation and support after migration."
  ),
  headingNode("What Users Need To Do Before Migration"),
  listNode([
    "Update Microsoft Teams to the latest available version.",
    "Confirm you can sign into Teams using your company account.",
    "Verify headsets, speakers, microphones and webcams.",
    "Confirm your account information and contact details are accurate.",
  ]),
  headingNode("What To Expect On Migration Day"),
  listNode([
    "Phone services may experience a brief interruption.",
    "Existing phone numbers should remain unchanged.",
    "Teams Calling functionality will become available.",
    "Some users may need to restart Teams.",
    "Voicemail may temporarily take additional time to activate.",
  ]),
  headingNode("How To Verify Teams Calling Is Working"),
  listNode([
    "Ask a colleague to call your extension or direct number.",
    "Place a call to an external phone number.",
    "Leave yourself a voicemail and confirm it is received and playable.",
    "Verify calling works on Teams desktop, mobile and approved Teams-certified devices.",
  ]),
  headingNode("When To Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if your phone number is missing, Teams Calling is unavailable, calls fail to connect, voicemail does not function, call quality issues persist or your device is not working correctly."
  ),
]);

const teamsCallingMigrationGuideLayout = {
  enabled: true,
  overview:
    "Your organisation is migrating to Microsoft Teams Calling to provide a modern cloud-based phone system that integrates directly with Microsoft Teams. This migration allows users to make and receive external phone calls using Teams while benefiting from improved flexibility, mobility and collaboration features. This article explains what is changing, when the migration is occurring, what users can expect, and what actions may be required before and after the transition.",
  beforeYouStart: [
    { item: "Update Microsoft Teams to the latest available version." },
    { item: "Confirm you can sign into Teams using your company account." },
    { item: "Check headsets, speakers, microphones and webcams before migration day." },
    { item: "Confirm your account information and contact details are accurate." },
  ],
  beforeYouStartCallout:
    "Specific migration dates will be communicated separately by your organisation. Keep an eye on internal updates before and during the transition.",
  steps: [
    {
      title: "Step 1: Understand What Teams Calling Provides",
      intro:
        "Teams Calling moves business phone features into Microsoft Teams and lets users make and receive calls from supported devices.",
      checklist: [
        { item: "Make and receive external phone calls." },
        { item: "Use a business phone number within Teams." },
        { item: "Transfer and forward calls." },
        { item: "Access voicemail." },
        { item: "Use desktop, mobile and headset devices." },
        { item: "Work from anywhere with an internet connection." },
      ],
      infoCards: [
        {
          title: "Business numbers",
          body: "Existing business phone numbers are generally migrated into Teams.",
          icon: "phone",
        },
        {
          title: "Cloud voice",
          body: "Traditional desk phone services are replaced or extended by a cloud-based platform.",
          icon: "cloud",
        },
      ],
    },
    {
      title: "Step 2: Review What Is Changing",
      intro:
        "The migration changes where calls, voicemail and call history are managed.",
      checklist: [
        { item: "Phone services will move into Microsoft Teams." },
        { item: "Existing business phone numbers will be migrated." },
        { item: "Voicemail services will be managed through Teams." },
        { item: "Call history will be available within Teams." },
        { item: "Some desk phones may be replaced or reconfigured." },
        { item: "Call handling settings may be updated." },
      ],
      callout: {
        type: "info",
        body: "Your organisation may also introduce new calling policies and user features as part of the migration.",
      },
    },
    {
      title: "Step 3: Know What Happens On Migration Day",
      intro:
        "Most migrations are completed with minimal disruption, but some brief service changes may occur while numbers and call routing are updated.",
      checklist: [
        { item: "Phone services may experience a brief interruption." },
        { item: "Existing phone numbers should remain unchanged." },
        { item: "Teams Calling functionality will become available." },
        { item: "Some users may need to restart Teams." },
        { item: "Voicemail may temporarily take additional time to activate." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Teams Calls tab after migration",
        icon: "phone",
      },
    },
    {
      title: "Step 4: Verify Teams Calling Is Working",
      intro:
        "After migration, test core calling features so any issues can be raised quickly.",
      checklist: [
        { item: "Ask a colleague to call your extension or direct number." },
        { item: "Place a call to an external phone number." },
        { item: "Leave yourself a voicemail and confirm the message is received." },
        { item: "Check voicemail notifications and playback." },
        { item: "Verify calling works on Teams desktop, mobile and approved Teams-certified devices." },
      ],
      infoCards: [
        { title: "Inbound calls", body: "Confirm your direct number or extension reaches you.", icon: "phone" },
        { title: "Outbound calls", body: "Place a test call to an external number.", icon: "arrow-right" },
        { title: "Voicemail", body: "Confirm messages, notifications and playback work correctly.", icon: "message-circle" },
      ],
    },
  ],
  extraSections: [
    {
      title: "Migration Timeline",
      checklist: [
        { item: "Before migration: user accounts are prepared." },
        { item: "Before migration: phone numbers are assigned." },
        { item: "Before migration: Teams Calling licences are configured." },
        { item: "Before migration: devices are assessed and user communications are distributed." },
        { item: "During migration: phone numbers are ported and calling services are activated." },
        { item: "During migration: call routing is updated and testing is completed." },
        { item: "After migration: user validation occurs and support teams remain available." },
        { item: "After migration: additional configuration may be completed." },
      ],
    },
    {
      title: "Common Post-Migration Questions",
      checklist: [
        { item: "Will my phone number change? In most cases, your existing business number will remain unchanged." },
        { item: "Will I lose my contacts? No. Teams contacts and Microsoft 365 contacts remain available." },
        { item: "Can I still use my mobile phone? Yes. Teams Calling supports desktop, mobile and web applications." },
        { item: "What happens to my desk phone? This depends on your organisation's configuration. Some devices may continue to operate while others may be retired or replaced." },
      ],
    },
    {
      title: "When To Contact Support",
      checklist: [
        { item: "Your phone number is missing." },
        { item: "Teams Calling is unavailable." },
        { item: "Calls fail to connect." },
        { item: "Voicemail does not function." },
        { item: "Call quality issues persist." },
        { item: "Your device is not working correctly." },
        { item: "Providing screenshots and error messages will help speed up troubleshooting." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Unable To Make Calls",
      content:
        "Check that Teams is signed in, the calling licence is assigned, internet connectivity is available and Teams has been restarted.",
    },
    {
      title: "No Dial Pad Visible",
      content:
        "The Teams Calling licence may not yet be fully provisioned. Contact your support team for assistance.",
    },
    {
      title: "Voicemail Not Working",
      content:
        "Allow time for voicemail services to synchronise. If the issue continues, contact support.",
    },
    {
      title: "Calls Have Poor Quality",
      content:
        "Verify internet connection stability, headset functionality, VPN performance and network availability. Poor network conditions can affect call quality.",
    },
  ],
  bestPracticeTips: [
    { title: "Use a Teams-certified headset", icon: "headphones" },
    { title: "Keep Teams updated", icon: "check-circle" },
    { title: "Use a stable internet connection", icon: "wifi" },
    { title: "Restart Teams periodically", icon: "monitor" },
    { title: "Configure voicemail greetings", icon: "message-circle" },
    { title: "Test devices before important calls", icon: "phone" },
  ],
  faqs: [
    {
      question: "Can I make external calls from Teams?",
      answer: "Yes. Teams Calling supports inbound and outbound business calls.",
    },
    {
      question: "Can I transfer calls?",
      answer: "Yes. Call transfer functionality remains available.",
    },
    {
      question: "Can I answer calls from my mobile phone?",
      answer: "Yes. Teams Calling works through the Teams mobile application.",
    },
    {
      question: "Will my call history transfer?",
      answer: "New call history will appear within Teams after migration.",
    },
    {
      question: "Do I need training?",
      answer:
        "Most users find Teams Calling intuitive, however training materials may be provided by your organisation.",
    },
  ],
};

const teamsAudioDeviceTroubleshootingContent = lexicalBlocks([
  paragraphNode(
    "Audio device issues in Microsoft Teams can prevent users from participating effectively in meetings, calls and collaboration sessions."
  ),
  paragraphNode(
    "Common symptoms include no sound during calls, microphone issues, headsets not being detected, poor audio quality, Bluetooth connection problems, echo or feedback during meetings."
  ),
  paragraphNode(
    "Most audio issues can be resolved by checking device settings, permissions and connectivity before contacting support."
  ),
  headingNode("Common Audio Problems"),
  paragraphNode("Users commonly report the following Microsoft Teams audio issues."),
  listNode([
    "Cannot hear other participants.",
    "Other participants cannot hear you.",
    "Teams is using the wrong headset.",
    "Microphone is muted or unavailable.",
    "Bluetooth devices disconnect frequently.",
    "Audio cuts in and out during meetings.",
    "Echo or feedback occurs during calls.",
    "Teams cannot detect audio devices.",
  ]),
  headingNode("Before You Start"),
  listNode([
    "Confirm your headset, speaker or microphone is connected.",
    "Ensure Microsoft Teams is updated.",
    "Close other applications that may be using the device.",
    "Restart Teams if the device was connected after Teams opened.",
    "Check that your internet connection is stable.",
  ]),
  headingNode("Step 1: Check Teams Audio Device Settings"),
  paragraphNode(
    "Microsoft Teams allows separate selection of speakers, microphones and cameras. Incorrect device selection is one of the most common causes of audio issues."
  ),
  listNode(
    [
      "Open Microsoft Teams.",
      "Select your profile picture.",
      "Click Settings.",
      "Select Devices.",
      "Confirm the correct speaker, microphone and audio device are selected.",
    ],
    "number",
  ),
  headingNode("Step 2: Run a Test Call"),
  paragraphNode(
    "Teams includes a built-in test call feature that plays audio, records a microphone sample and confirms whether playback is working."
  ),
  headingNode("Step 3: Verify Device Connections"),
  paragraphNode(
    "For USB headsets, disconnect the device, wait 10 seconds, reconnect directly to the computer and avoid USB hubs where possible. For Bluetooth headsets, disconnect and reconnect the device, confirm pairing remains active and remove and re-pair the device if required."
  ),
  headingNode("Step 4: Check Windows Audio Settings"),
  paragraphNode(
    "In Windows 11, open Settings, select System, then Sound. Verify the correct output and input devices are selected and device volume is not muted."
  ),
  headingNode("Step 5: Check Microphone Permissions"),
  paragraphNode(
    "Windows privacy settings can block microphone access. Ensure microphone access is enabled, apps can access your microphone and Microsoft Teams has permission."
  ),
  headingNode("Step 6: Check macOS Permissions"),
  paragraphNode(
    "On macOS, open System Settings, select Privacy & Security, then Microphone. Confirm Microsoft Teams is allowed access and restart Teams after granting permission."
  ),
  headingNode("Step 7: Restart Teams Completely"),
  paragraphNode(
    "Sometimes Teams fails to recognise newly connected devices. Quit Microsoft Teams completely, close it from the system tray if running, reopen Teams and test audio again."
  ),
  headingNode("Step 8: Update Headset Firmware"),
  paragraphNode(
    "Many modern business headsets include firmware updates from manufacturers such as Jabra, Poly, Logitech and EPOS. Firmware updates often improve stability, call quality and Teams compatibility."
  ),
  headingNode("When To Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if Teams cannot detect your device, audio remains poor after testing, the issue affects multiple users, headsets disconnect repeatedly, Teams crashes when accessing devices or audio devices work in other applications but not Teams."
  ),
]);

const teamsAudioDeviceTroubleshootingGuideLayout = {
  enabled: true,
  overview:
    "Audio device issues in Microsoft Teams can prevent users from participating effectively in meetings, calls and collaboration sessions. Common symptoms include no sound during calls, microphone issues, headsets not being detected, poor audio quality, Bluetooth connection problems, echo or feedback during meetings. Most audio issues can be resolved by checking device settings, permissions and connectivity before contacting support.",
  beforeYouStart: [
    { item: "Confirm your headset, speaker or microphone is connected." },
    { item: "Ensure Microsoft Teams is updated." },
    { item: "Close other applications that may be using the device." },
    { item: "Restart Teams if the device was connected after Teams opened." },
    { item: "Check that your internet connection is stable." },
  ],
  beforeYouStartCallout:
    "If the issue started immediately after connecting a new headset, restart Teams before making deeper changes. Teams may not detect newly connected devices until it is reopened.",
  steps: [
    {
      title: "Step 1: Check Teams Audio Device Settings",
      intro:
        "Microsoft Teams allows separate selection of speaker, microphone and camera devices. Incorrect device selection is one of the most common causes of audio issues.",
      checklist: [
        { item: "Open Microsoft Teams." },
        { item: "Select your profile picture." },
        { item: "Click Settings." },
        { item: "Select Devices." },
        { item: "Confirm the correct speaker is selected." },
        { item: "Confirm the correct microphone is selected." },
        { item: "Confirm the correct audio device is selected." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Microsoft Teams device settings",
        icon: "headphones",
      },
      callout: {
        type: "info",
        body: "Incorrect device selection is one of the most common causes of Teams audio issues.",
      },
    },
    {
      title: "Step 2: Run a Test Call",
      intro:
        "Teams includes a built-in test feature that confirms whether your selected speaker and microphone are working.",
      checklist: [
        { item: "Open Teams Settings." },
        { item: "Select Devices." },
        { item: "Click Make a Test Call." },
        { item: "Confirm Teams plays audio through your selected speaker." },
        { item: "Confirm your microphone records and plays back a sample." },
      ],
      callout: {
        type: "info",
        body: "If the test call fails, continue with the remaining troubleshooting steps.",
      },
    },
    {
      title: "Step 3: Verify Device Connections",
      intro:
        "Reconnect physical and wireless devices to rule out connection or pairing issues.",
      checklist: [
        { item: "For USB headsets, disconnect the device." },
        { item: "Wait 10 seconds." },
        { item: "Reconnect directly to the computer." },
        { item: "Avoid USB hubs where possible." },
        { item: "For Bluetooth headsets, disconnect and reconnect the device." },
        { item: "Confirm pairing remains active." },
        { item: "Remove and re-pair the Bluetooth device if required." },
      ],
      infoCards: [
        {
          title: "USB devices",
          body: "Connect directly to the computer where possible instead of using a hub.",
          icon: "monitor",
        },
        {
          title: "Bluetooth devices",
          body: "Confirm the headset remains paired and has sufficient battery.",
          icon: "headphones",
        },
      ],
    },
    {
      title: "Step 4: Check Windows Audio Settings",
      intro:
        "Windows can use different input and output devices than Teams, so confirm system-level settings as well.",
      checklist: [
        { item: "Open Settings." },
        { item: "Select System." },
        { item: "Select Sound." },
        { item: "Verify the correct output device is selected." },
        { item: "Verify the correct input device is selected." },
        { item: "Confirm device volume is not muted." },
      ],
    },
    {
      title: "Step 5: Check Microphone Permissions",
      intro:
        "Windows privacy settings can block microphone access, preventing Teams from using the selected microphone.",
      checklist: [
        { item: "Open Settings." },
        { item: "Select Privacy & Security." },
        { item: "Select Microphone." },
        { item: "Ensure Microphone access is enabled." },
        { item: "Ensure Let apps access your microphone is enabled." },
        { item: "Confirm Microsoft Teams has permission." },
      ],
      callout: {
        type: "warning",
        body: "Without microphone permission, Teams cannot use your microphone.",
      },
    },
    {
      title: "Step 6: Check macOS Permissions",
      intro:
        "macOS also controls microphone access at the operating system level.",
      checklist: [
        { item: "Open System Settings." },
        { item: "Select Privacy & Security." },
        { item: "Select Microphone." },
        { item: "Confirm Microsoft Teams is allowed access." },
        { item: "Restart Teams after granting permission." },
      ],
    },
    {
      title: "Step 7: Restart Teams Completely",
      intro:
        "Sometimes Teams fails to recognise newly connected devices until the application is fully restarted.",
      checklist: [
        { item: "Quit Microsoft Teams completely." },
        { item: "Close Teams from the system tray if it is still running." },
        { item: "Reopen Teams." },
        { item: "Test audio again." },
      ],
    },
    {
      title: "Step 8: Update Headset Firmware",
      intro:
        "Many modern business headsets include firmware updates that improve stability, call quality and Teams compatibility.",
      checklist: [
        { item: "Check the headset manufacturer's update utility." },
        { item: "Common vendors include Jabra, Poly, Logitech and EPOS." },
        { item: "Install available firmware updates." },
        { item: "Reconnect the headset and run another Teams test call." },
      ],
    },
  ],
  extraSections: [
    {
      title: "Common Audio Problems",
      checklist: [
        { item: "Cannot hear other participants." },
        { item: "Other participants cannot hear you." },
        { item: "Teams is using the wrong headset." },
        { item: "Microphone is muted or unavailable." },
        { item: "Bluetooth devices disconnect frequently." },
        { item: "Audio cuts in and out during meetings." },
        { item: "Echo or feedback occurs during calls." },
        { item: "Teams cannot detect audio devices." },
      ],
    },
    {
      title: "When To Contact Support",
      checklist: [
        { item: "Teams cannot detect your device." },
        { item: "Audio remains poor after testing." },
        { item: "The issue affects multiple users." },
        { item: "Headsets disconnect repeatedly." },
        { item: "Teams crashes when accessing devices." },
        { item: "Audio devices work in other applications but not Teams." },
        {
          item: "Providing screenshots of Teams device settings and any error messages will assist with faster troubleshooting.",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Other People Cannot Hear Me",
      content:
        "Check that your microphone is not muted, the correct microphone is selected, Teams permissions are enabled and the headset microphone is functioning. Run a Teams test call after making changes.",
    },
    {
      title: "I Cannot Hear Other Participants",
      content:
        "Check speaker volume, confirm the correct output device is selected, verify the headset is connected correctly and review Windows sound settings. Test audio using another application if needed.",
    },
    {
      title: "Bluetooth Audio Keeps Dropping Out",
      content:
        "Check battery level, Bluetooth signal strength, wireless interference and distance from the computer. A wired headset may provide improved stability.",
    },
    {
      title: "Echo or Feedback During Meetings",
      content:
        "Echo is commonly caused by speakers positioned too close to microphones, multiple devices joined to the same meeting or high speaker volume. Using a headset typically resolves echo issues.",
    },
    {
      title: "Audio Quality Is Poor",
      content:
        "Poor quality may be caused by slow internet connections, Wi-Fi congestion, VPN performance, high CPU utilisation or network instability. Test on another network if possible.",
    },
  ],
  bestPracticeTips: [
    { title: "Use a Teams-certified headset", icon: "headphones" },
    { title: "Keep Teams updated", icon: "check-circle" },
    { title: "Keep device firmware updated", icon: "monitor" },
    { title: "Use a wired connection when possible", icon: "wifi" },
    { title: "Perform test calls regularly", icon: "phone" },
    {
      title: "Restart Teams after connecting new devices",
      body: "This helps Teams detect newly connected headsets, microphones and speakers.",
      icon: "headphones",
    },
  ],
  faqs: [
    {
      question: "Why does Teams keep switching audio devices?",
      answer:
        "Windows may automatically change the default audio device when new hardware is connected.",
    },
    {
      question: "Why does my headset work in other apps but not Teams?",
      answer:
        "Teams may be configured to use a different device than Windows.",
    },
    {
      question: "Should I use Bluetooth or USB?",
      answer:
        "USB headsets generally provide the most reliable experience for business calls.",
    },
    {
      question: "Why does my microphone work sometimes but not always?",
      answer:
        "Permission settings, driver issues or conflicting applications may be preventing access.",
    },
    {
      question: "Can poor internet affect audio quality?",
      answer:
        "Yes. Network performance plays a major role in Teams call quality.",
    },
  ],
};

const securityAdvisoryAprilContent = lexicalBlocks([
  paragraphNode(
    "This security advisory highlights current cyber security risks, emerging threats and recommended mitigation actions relevant to organisations using Microsoft 365, cloud services, business applications and modern workplace technologies."
  ),
  paragraphNode(
    "Cyber threats continue to evolve rapidly, making proactive security measures essential for protecting business systems, customer information and operational continuity."
  ),
  paragraphNode(
    "This advisory provides practical recommendations to help reduce risk and improve cyber resilience."
  ),
  headingNode("Advisory Details"),
  listNode([
    "Advisory Type: Security Awareness and Risk Reduction.",
    "Severity: Medium.",
    "Published Date: April 2024.",
    "Audience: All Users.",
    "Estimated Reading Time: 5 minutes.",
  ]),
  headingNode("Affected Systems"),
  listNode([
    "Microsoft 365.",
    "Microsoft Teams.",
    "Exchange Online.",
    "OneDrive.",
    "SharePoint.",
    "Windows 10 and Windows 11.",
    "Remote access and VPN platforms.",
    "Business email systems.",
  ]),
  headingNode("Current Threat Landscape"),
  paragraphNode(
    "Recent trends continue to show increased activity involving phishing campaigns, Business Email Compromise, credential theft, ransomware attacks, MFA fatigue attacks and social engineering attempts."
  ),
  paragraphNode(
    "Attackers are increasingly targeting users rather than systems, making security awareness a critical defence layer."
  ),
  headingNode("Recommended Actions"),
  listNode(
    [
      "Verify Multi-Factor Authentication is enabled for Microsoft 365, VPN access, administrative accounts and cloud applications.",
      "Review password security and avoid password reuse.",
      "Apply Windows, Microsoft application, browser and security software updates.",
      "Review email security awareness and report phishing attempts.",
      "Validate backup processes, restoration testing and documented recovery procedures.",
    ],
    "number",
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk immediately if you clicked a suspicious link, opened a suspicious attachment, approved an unexpected MFA request, suspect account compromise, observe unusual account activity or require assistance implementing security recommendations."
  ),
]);

const securityAdvisoryAprilGuideLayout = {
  enabled: true,
  overview:
    "This security advisory highlights current cyber security risks, emerging threats and recommended mitigation actions relevant to organisations using Microsoft 365, cloud services, business applications and modern workplace technologies. Cyber threats continue to evolve rapidly, making proactive security measures essential for protecting business systems, customer information and operational continuity. This advisory provides practical recommendations to help reduce risk and improve cyber resilience.",
  beforeYouStart: [
    { item: "Review the advisory details and affected systems." },
    { item: "Share relevant recommendations with end users and team leaders." },
    { item: "Prioritise actions that reduce account compromise and ransomware risk." },
    { item: "Contact Genisys Support immediately if suspicious activity is identified." },
  ],
  beforeYouStartCallout:
    "This advisory is preventative guidance and does not indicate that a security breach has occurred.",
  steps: [
    {
      title: "Advisory Details",
      intro:
        "This advisory is intended to raise awareness of current cyber security risks and practical risk reduction actions for April 2024.",
      checklist: [
        { item: "Advisory Type: Security Awareness and Risk Reduction." },
        { item: "Severity: Medium." },
        { item: "Published Date: April 2024." },
        { item: "Audience: All Users." },
        { item: "Estimated Reading Time: 5 minutes." },
      ],
      infoCards: [
        {
          title: "Advisory Type",
          body: "Security Awareness and Risk Reduction",
          icon: "shield-check",
        },
        {
          title: "Severity",
          body: "Medium",
          icon: "shield-alert",
        },
        {
          title: "Published Date",
          body: "April 2024",
          icon: "clock",
        },
        {
          title: "Audience",
          body: "All Users",
          icon: "info",
        },
      ],
    },
    {
      title: "Affected Systems",
      intro:
        "Potentially affected environments include Microsoft 365, cloud services, endpoint devices and remote access platforms.",
      checklist: [
        { item: "Microsoft 365." },
        { item: "Microsoft Teams." },
        { item: "Exchange Online." },
        { item: "OneDrive." },
        { item: "SharePoint." },
        { item: "Windows 10 and Windows 11." },
        { item: "Remote access and VPN platforms." },
        { item: "Business email systems." },
      ],
    },
    {
      title: "Target Audience",
      intro:
        "This advisory is relevant to both business users and teams responsible for managing technology risk.",
      checklist: [
        { item: "End Users." },
        { item: "IT Administrators." },
        { item: "Business Owners." },
        { item: "Department Managers." },
        { item: "Security Teams." },
      ],
    },
    {
      title: "Current Threat Landscape",
      intro:
        "Recent trends continue to show increased activity targeting identities, email systems and user decision-making.",
      checklist: [
        { item: "Phishing campaigns." },
        { item: "Business Email Compromise (BEC)." },
        { item: "Credential theft." },
        { item: "Ransomware attacks." },
        { item: "MFA fatigue attacks." },
        { item: "Social engineering attempts." },
        {
          item: "Attackers are increasingly targeting users rather than systems, making security awareness a critical defence layer.",
        },
      ],
      callout: {
        type: "warning",
        body: "Never approve an MFA request that you did not initiate. Unexpected prompts should be reported immediately.",
      },
    },
    {
      title: "Recommended Action 1: Verify Multi-Factor Authentication",
      intro:
        "MFA remains one of the most effective protections against account compromise.",
      checklist: [
        { item: "Ensure MFA is enabled for Microsoft 365." },
        { item: "Ensure MFA is enabled for VPN access." },
        { item: "Ensure MFA is enabled for administrative accounts." },
        { item: "Ensure MFA is enabled for cloud applications." },
      ],
    },
    {
      title: "Recommended Action 2: Review Password Security",
      intro:
        "Compromised credentials remain one of the most common causes of security incidents.",
      checklist: [
        { item: "Use unique passwords." },
        { item: "Avoid password reuse." },
        { item: "Use password managers where appropriate." },
        { item: "Reset passwords immediately if compromise is suspected." },
      ],
    },
    {
      title: "Recommended Action 3: Apply Security Updates",
      intro:
        "Prompt patching helps reduce exposure to known vulnerabilities.",
      checklist: [
        { item: "Verify Windows updates are installed." },
        { item: "Verify Microsoft applications are current." },
        { item: "Verify browsers are updated." },
        { item: "Verify security software is operating correctly." },
      ],
    },
    {
      title: "Recommended Action 4: Review Email Security Awareness",
      intro:
        "Security awareness remains an important defence against social engineering attacks.",
      checklist: [
        { item: "Verify unexpected requests." },
        { item: "Avoid suspicious links." },
        { item: "Report phishing attempts." },
        { item: "Review email sender information carefully." },
      ],
    },
    {
      title: "Recommended Action 5: Validate Backup Processes",
      intro:
        "Reliable backups are critical for ransomware resilience.",
      checklist: [
        { item: "Ensure backups are operating successfully." },
        { item: "Perform restoration testing regularly." },
        { item: "Confirm critical business data is protected." },
        { item: "Document recovery procedures." },
      ],
    },
  ],
  extraSections: [
    {
      title: "What Users Should Do",
      checklist: [
        { item: "Report suspicious emails." },
        { item: "Verify unusual requests." },
        { item: "Lock devices when unattended." },
        { item: "Keep devices updated." },
        { item: "Follow company security policies." },
        { item: "Contact support if unsure about any suspicious activity." },
        { item: "When in doubt, ask before acting." },
      ],
    },
    {
      title: "Indicators of Potential Compromise",
      checklist: [
        { item: "Unexpected MFA requests." },
        { item: "Unknown sign-in notifications." },
        { item: "Missing emails." },
        { item: "Unauthorised mailbox rules." },
        { item: "Password changes you did not initiate." },
        { item: "Suspicious sent messages." },
        { item: "Unusual account activity." },
        { item: "Early detection significantly reduces risk." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "You clicked a suspicious link." },
        { item: "You opened a suspicious attachment." },
        { item: "You approved an unexpected MFA request." },
        { item: "You suspect account compromise." },
        { item: "You observe unusual account activity." },
        { item: "You require assistance implementing security recommendations." },
        {
          item: "Prompt reporting helps minimise risk and improves incident response outcomes.",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Phishing Emails",
      content:
        "Fraudulent emails continue to impersonate Microsoft 365, courier services, financial institutions, suppliers and internal staff. Users should remain cautious of unexpected requests, urgent messages and unfamiliar links.",
    },
    {
      title: "Credential Theft",
      content:
        "Attackers frequently attempt to obtain Microsoft 365 passwords, VPN credentials and business application logins. Compromised credentials remain one of the most common causes of security incidents.",
    },
    {
      title: "MFA Fatigue Attacks",
      content:
        "Users may receive repeated authentication requests designed to encourage accidental approval. Never approve an MFA request that you did not initiate and report unexpected prompts immediately.",
    },
    {
      title: "Ransomware",
      content:
        "Ransomware remains a significant threat to organisations of all sizes. Common entry points include malicious attachments, compromised credentials, unpatched systems and remote access services.",
    },
  ],
  bestPracticeTips: [
    { title: "Use MFA everywhere possible", icon: "shield-check" },
    { title: "Apply updates regularly", icon: "check-circle" },
    { title: "Use strong passwords", icon: "lock" },
    { title: "Secure mobile devices", icon: "smartphone" },
    { title: "Follow least-privilege principles", icon: "shield-alert" },
    {
      title: "Complete security awareness training",
      body: "Training helps users identify suspicious requests before they become incidents.",
      icon: "book-open",
    },
  ],
  faqs: [
    {
      question: "Does this advisory indicate a security breach?",
      answer:
        "No. This advisory is intended to provide preventative guidance and raise awareness of current cyber security risks.",
    },
    {
      question: "Do I need to take action?",
      answer:
        "Yes. Users should review the recommended actions and ensure security best practices are being followed.",
    },
    {
      question: "Why are phishing emails becoming more convincing?",
      answer:
        "Attackers increasingly use legitimate branding, AI-generated content and social engineering techniques to improve credibility.",
    },
    {
      question: "What should I do if I receive a suspicious email?",
      answer:
        "Do not interact with the message and report it to your IT support team.",
    },
    {
      question: "How often are security advisories published?",
      answer:
        "Security advisories may be published whenever significant risks, vulnerabilities or emerging threats are identified.",
    },
  ],
};

const essentialEightArticleContent = lexicalBlocks([
  paragraphNode(
    "The Essential Eight is a cybersecurity framework developed by the Australian Cyber Security Centre (ACSC) to help organisations strengthen their security posture and reduce the risk of cyber attacks."
  ),
  paragraphNode(
    "The framework focuses on eight practical mitigation strategies designed to protect against common threats including ransomware, phishing attacks, malware, compromised accounts and unauthorised access."
  ),
  paragraphNode(
    "Whether your organisation is beginning its cybersecurity journey or working towards higher levels of compliance, the Essential Eight provides a practical roadmap for improving security maturity."
  ),
  headingNode("What Is the Essential Eight?"),
  paragraphNode(
    "The Essential Eight consists of eight security controls recommended by the ACSC. Many Australian organisations use the framework as part of their broader cyber security strategy."
  ),
  listNode([
    "Reduce cyber security risks.",
    "Improve organisational resilience.",
    "Protect sensitive business information.",
    "Minimise ransomware exposure.",
    "Strengthen access controls.",
    "Improve incident recovery capabilities.",
  ]),
  headingNode("The Eight Essential Controls"),
  listNode(
    [
      "Application control restricts which applications can run on company devices.",
      "Patch applications to reduce exposure to known software vulnerabilities.",
      "Configure Microsoft Office macro settings to reduce malicious document risk.",
      "Harden user applications by reducing high-risk browser and application features.",
      "Restrict administrative privileges and review elevated access regularly.",
      "Patch operating systems promptly and remove unsupported platforms.",
      "Use Multi-Factor Authentication across Microsoft 365, remote access, business applications and administrative accounts.",
      "Maintain regular backups and test restoration processes.",
    ],
    "number",
  ),
  headingNode("Understanding Maturity Levels"),
  paragraphNode(
    "The Essential Eight framework uses maturity levels to measure implementation effectiveness. Maturity Level 1 focuses on opportunistic attacks, Maturity Level 2 provides stronger protection against more sophisticated threats and Maturity Level 3 targets advanced adversaries using modern attack techniques."
  ),
  headingNode("Common Essential Eight Gaps"),
  listNode([
    "Patch management processes.",
    "Multi-Factor Authentication coverage.",
    "Administrative privilege management.",
    "Backup validation procedures.",
    "Endpoint visibility.",
    "Security monitoring.",
  ]),
  headingNode("Practical First Steps"),
  listNode(
    [
      "Conduct a baseline assessment.",
      "Identify existing controls.",
      "Document current maturity levels.",
      "Prioritise high-risk gaps.",
      "Develop a remediation roadmap.",
      "Measure progress regularly.",
    ],
    "number",
  ),
  headingNode("When to Seek Assistance"),
  paragraphNode(
    "Consider engaging a cyber security specialist if you are unsure of your current maturity level, need an Essential Eight assessment, have increasing compliance requirements or require remediation planning and executive reporting."
  ),
]);

const essentialEightGuideLayout = {
  enabled: true,
  overview:
    "The Essential Eight is a cybersecurity framework developed by the Australian Cyber Security Centre (ACSC) to help organisations strengthen their security posture and reduce the risk of cyber attacks. The framework focuses on eight practical mitigation strategies designed to protect against common threats including ransomware, phishing attacks, malware, compromised accounts and unauthorised access. Whether your organisation is beginning its cybersecurity journey or working towards higher levels of compliance, the Essential Eight provides a practical roadmap for improving security maturity.",
  beforeYouStart: [
    { item: "Confirm whether your organisation already has cyber security policies, assessments or compliance obligations." },
    { item: "Identify systems that hold sensitive business, customer or operational data." },
    { item: "Collect information about Microsoft 365, endpoint protection, backups, remote access and administrator accounts." },
    { item: "Decide whether you need a baseline assessment, remediation roadmap or maturity-level target." },
  ],
  beforeYouStartCallout:
    "Not every organisation requires the same maturity target. The appropriate level depends on business risk, regulatory requirements and organisational objectives.",
  steps: [
    {
      title: "Step 1: Application Control",
      intro:
        "Application control restricts which applications can run on company devices and helps prevent unauthorised software execution.",
      checklist: [
        { item: "Create approved software lists." },
        { item: "Block unknown applications." },
        { item: "Regularly review installed software." },
        { item: "Use application control to reduce malware infections and improve software governance." },
      ],
      infoCards: [
        {
          title: "Primary benefit",
          body: "Prevents unauthorised software and reduces the likelihood of malware execution.",
          icon: "shield-check",
        },
      ],
    },
    {
      title: "Step 2: Patch Applications",
      intro:
        "Cybercriminals frequently exploit vulnerabilities in outdated software. Timely patching significantly reduces risk.",
      checklist: [
        { item: "Update browsers regularly." },
        { item: "Patch Adobe products." },
        { item: "Update productivity applications." },
        { item: "Remove unsupported software." },
      ],
      callout: {
        type: "info",
        body: "Prioritise patching for internet-facing, frequently used and high-risk applications.",
      },
    },
    {
      title: "Step 3: Configure Microsoft Office Macro Settings",
      intro:
        "Macros can be used to deliver malicious code, and many ransomware attacks begin through malicious Office documents.",
      checklist: [
        { item: "Block internet-originated macros." },
        { item: "Restrict unnecessary macro usage." },
        { item: "Educate users about macro risks." },
        { item: "Review business processes that still rely on macros." },
      ],
    },
    {
      title: "Step 4: User Application Hardening",
      intro:
        "Hardening reduces attack surfaces within applications by disabling unsupported or high-risk functionality.",
      checklist: [
        { item: "Block Flash content." },
        { item: "Restrict unnecessary browser features." },
        { item: "Disable unsupported components." },
        { item: "Limit high-risk functionality." },
      ],
    },
    {
      title: "Step 5: Restrict Administrative Privileges",
      intro:
        "Administrative accounts should be tightly controlled to reduce the impact of compromised accounts.",
      checklist: [
        { item: "Use separate administrator accounts." },
        { item: "Grant minimum required access." },
        { item: "Review permissions regularly." },
        { item: "Remove unnecessary privileges." },
      ],
      callout: {
        type: "warning",
        body: "Compromised administrator accounts can significantly increase the impact of a cyber incident.",
      },
    },
    {
      title: "Step 6: Patch Operating Systems",
      intro:
        "Operating system vulnerabilities are a common attack vector and should be addressed through reliable update processes.",
      checklist: [
        { item: "Apply Windows updates promptly." },
        { item: "Enable automated updates where appropriate." },
        { item: "Remove unsupported operating systems." },
        { item: "Test critical updates before deployment." },
      ],
    },
    {
      title: "Step 7: Multi-Factor Authentication (MFA)",
      intro:
        "MFA adds an additional layer of protection beyond passwords and helps reduce account compromise risk.",
      checklist: [
        { item: "Protect Microsoft 365 accounts." },
        { item: "Protect remote access systems." },
        { item: "Protect business applications." },
        { item: "Protect administrative accounts." },
      ],
      infoCards: [
        {
          title: "High-priority control",
          body: "MFA protects against credential theft and strengthens identity security.",
          icon: "lock",
        },
      ],
    },
    {
      title: "Step 8: Regular Backups",
      intro:
        "Backups help organisations recover from ransomware attacks, hardware failures, accidental deletion and system outages.",
      checklist: [
        { item: "Automate backups." },
        { item: "Test restorations regularly." },
        { item: "Store copies offsite." },
        { item: "Follow the 3-2-1 backup principle." },
      ],
    },
  ],
  extraSections: [
    {
      title: "What Is the Essential Eight?",
      checklist: [
        { item: "The Essential Eight consists of eight security controls recommended by the ACSC." },
        { item: "The controls help reduce cyber security risks and improve organisational resilience." },
        { item: "They protect sensitive business information and minimise ransomware exposure." },
        { item: "They strengthen access controls and improve incident recovery capabilities." },
        { item: "Many Australian organisations use the framework as part of their broader cyber security strategy." },
      ],
    },
    {
      title: "Understanding Maturity Levels",
      checklist: [
        { item: "Maturity Level 1 focuses on protecting against opportunistic attacks." },
        { item: "Maturity Level 2 provides stronger protection against more sophisticated threats." },
        { item: "Maturity Level 3 targets advanced adversaries using modern attack techniques." },
        { item: "The appropriate maturity target depends on business risk, regulatory requirements and organisational objectives." },
      ],
    },
    {
      title: "Benefits of Essential Eight Compliance",
      checklist: [
        { item: "Reduced cyber risk." },
        { item: "Improved security governance." },
        { item: "Better incident recovery." },
        { item: "Enhanced cyber resilience." },
        { item: "Increased customer confidence." },
        { item: "Stronger compliance posture." },
      ],
    },
    {
      title: "When to Seek Assistance",
      checklist: [
        { item: "You are unsure of your current maturity level." },
        { item: "You need an Essential Eight assessment." },
        { item: "Compliance requirements are increasing." },
        { item: "You are planning a cyber security uplift." },
        { item: "You require executive reporting or remediation planning." },
        { item: "A structured assessment can help identify gaps and prioritise improvements." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Patch management gaps",
      content:
        "Many organisations do not have consistent processes for identifying, prioritising and deploying application and operating system patches.",
    },
    {
      title: "MFA coverage gaps",
      content:
        "MFA may be enabled for some users but missing from administrative accounts, remote access systems or business-critical applications.",
    },
    {
      title: "Administrative privilege gaps",
      content:
        "Unnecessary elevated permissions, shared administrator accounts and infrequent access reviews can increase cyber risk.",
    },
    {
      title: "Backup validation gaps",
      content:
        "Backups may exist but restorations are not always tested, documented or aligned to recovery objectives.",
    },
    {
      title: "Endpoint visibility and monitoring gaps",
      content:
        "Limited endpoint visibility and security monitoring can make it harder to detect suspicious activity early.",
    },
  ],
  bestPracticeTips: [
    {
      title: "Conduct a baseline assessment",
      body: "Understand your current controls before setting a maturity target.",
      icon: "book-open",
    },
    {
      title: "Identify existing controls",
      body: "Document what is already in place across endpoints, cloud services and user accounts.",
      icon: "check-circle",
    },
    {
      title: "Prioritise high-risk gaps",
      body: "Focus first on gaps that expose sensitive systems or increase ransomware risk.",
      icon: "shield-alert",
    },
    {
      title: "Develop a remediation roadmap",
      body: "Break improvement work into clear, measurable stages.",
      icon: "arrow-right",
    },
    {
      title: "Measure progress regularly",
      body: "Review maturity and control effectiveness over time.",
      icon: "clock",
    },
    {
      title: "Start with MFA, patching and backups",
      body: "These controls are often high-priority starting points for many organisations.",
      icon: "shield-check",
    },
  ],
  faqs: [
    {
      question: "Is Essential Eight mandatory?",
      answer:
        "Requirements vary by industry and organisation. Many businesses voluntarily adopt the framework to strengthen security.",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Implementation time depends on organisational size, existing controls and target maturity level.",
    },
    {
      question: "Is Essential Eight only for government organisations?",
      answer:
        "No. The framework is widely adopted across private sector organisations of all sizes.",
    },
    {
      question: "What is the most important control?",
      answer:
        "All controls work together, however MFA, patching and backups are often considered high-priority starting points.",
    },
    {
      question: "How often should Essential Eight be reviewed?",
      answer:
        "Most organisations should review controls annually or after significant business or technology changes.",
    },
  ],
};

const backupRecoveryContent = lexicalBlocks([
  paragraphNode(
    "Backups are one of the most important safeguards an organisation can implement to protect business data and maintain operational continuity."
  ),
  paragraphNode(
    "Whether data is lost due to ransomware, accidental deletion, hardware failure, software corruption or natural disasters, a well-designed backup and recovery strategy can significantly reduce downtime and minimise business disruption."
  ),
  paragraphNode(
    "This guide outlines backup best practices, recovery considerations and practical steps organisations can take to improve resilience."
  ),
  headingNode("Why Backups Matter"),
  paragraphNode("Data loss can occur unexpectedly and often without warning."),
  listNode([
    "Ransomware attacks.",
    "Accidental deletion.",
    "Hardware failure.",
    "Software corruption.",
    "Human error.",
    "Cloud service issues.",
    "Natural disasters.",
    "Malicious activity.",
  ]),
  headingNode("What Should Be Backed Up?"),
  listNode([
    "Microsoft 365 data.",
    "Email mailboxes.",
    "OneDrive files.",
    "SharePoint data.",
    "Teams data.",
    "File servers.",
    "Business applications.",
    "Databases.",
    "Financial records.",
    "Customer information.",
  ]),
  headingNode("Understanding Recovery Objectives"),
  paragraphNode(
    "Recovery Point Objective determines how much data loss is acceptable, while Recovery Time Objective defines how quickly systems must be restored."
  ),
  headingNode("The 3-2-1 Backup Rule"),
  listNode([
    "Maintain 3 copies of your data.",
    "Store data on 2 different types of media.",
    "Keep at least 1 copy stored offsite or offline.",
  ]),
  paragraphNode(
    "This approach helps protect against hardware failure, ransomware and environmental risks."
  ),
  headingNode("Backup Best Practices"),
  listNode([
    "Automate backups and monitor completion.",
    "Back up Microsoft 365 data such as Exchange Online, SharePoint, OneDrive and Teams.",
    "Maintain offsite or offline copies.",
    "Encrypt backup data at rest and during transfer.",
    "Regularly review backup jobs, failures, storage capacity and retention periods.",
    "Test recovery procedures and document results.",
  ]),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if backups are failing, recovery objectives are unclear, Microsoft 365 protection requires review, recovery testing has not been performed recently, storage capacity issues are occurring or you need assistance validating restoration procedures."
  ),
]);

const backupRecoveryGuideLayout = {
  enabled: true,
  overview:
    "Backups are one of the most important safeguards an organisation can implement to protect business data and maintain operational continuity. Whether data is lost due to ransomware, accidental deletion, hardware failure, software corruption or natural disasters, a well-designed backup and recovery strategy can significantly reduce downtime and minimise business disruption. This guide outlines backup best practices, recovery considerations and practical steps organisations can take to improve resilience.",
  beforeYouStart: [
    { item: "Identify systems and data that are critical to business operations." },
    { item: "Confirm who is responsible for backup monitoring and recovery decisions." },
    { item: "Define acceptable data loss and recovery time expectations." },
    { item: "Review whether Microsoft 365 and cloud application data is protected." },
    { item: "Document recent backup failures or restoration test results before contacting support." },
  ],
  beforeYouStartCallout:
    "Successful backups should never be assumed. Recovery readiness depends on reliable backups, clear recovery objectives and regular restoration testing.",
  steps: [
    {
      title: "Why Backups Matter",
      intro:
        "Data loss can occur unexpectedly and often without warning. Without reliable backups, recovering lost information can be difficult, costly or impossible.",
      checklist: [
        { item: "Ransomware attacks." },
        { item: "Accidental deletion." },
        { item: "Hardware failure." },
        { item: "Software corruption." },
        { item: "Human error." },
        { item: "Cloud service issues." },
        { item: "Natural disasters." },
        { item: "Malicious activity." },
      ],
      callout: {
        type: "warning",
        body: "Backups are a foundational control for ransomware resilience and business continuity.",
      },
    },
    {
      title: "What Should Be Backed Up?",
      intro:
        "A backup strategy should prioritise systems that are essential for business operations.",
      checklist: [
        { item: "Microsoft 365 data." },
        { item: "Email mailboxes." },
        { item: "OneDrive files." },
        { item: "SharePoint data." },
        { item: "Teams data." },
        { item: "File servers." },
        { item: "Business applications." },
        { item: "Databases." },
        { item: "Financial records." },
        { item: "Customer information." },
      ],
      infoCards: [
        {
          title: "Business-critical systems",
          body: "Prioritise systems required for operations, customer service and financial processes.",
          icon: "grid-2x2",
        },
        {
          title: "Cloud data",
          body: "Confirm whether Microsoft 365 and SaaS application data is protected by a dedicated backup solution.",
          icon: "cloud",
        },
      ],
    },
    {
      title: "Understanding Recovery Objectives",
      intro:
        "Before implementing backups, organisations should define recovery requirements.",
      checklist: [
        { item: "Recovery Point Objective determines how much data loss is acceptable." },
        { item: "Daily backups may result in up to 24 hours of lost data." },
        { item: "Hourly backups reduce potential data loss." },
        { item: "Recovery Time Objective defines how quickly systems must be restored." },
        { item: "Critical systems may need to be restored within hours." },
        { item: "Less critical systems may be restored within days." },
      ],
      callout: {
        type: "info",
        body: "RPO and RTO help shape backup, retention and disaster recovery strategies.",
      },
    },
    {
      title: "The 3-2-1 Backup Rule",
      intro:
        "A widely accepted backup strategy is the 3-2-1 rule, which helps protect against hardware failure, ransomware and environmental risks.",
      checklist: [
        { item: "Maintain 3 copies of your data." },
        { item: "Store backups on 2 different types of media." },
        { item: "Keep at least 1 copy stored offsite or offline." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Diagram placeholder: 3-2-1 backup rule",
        icon: "grid-2x2",
      },
    },
    {
      title: "Backup Best Practice 1: Automate Backups",
      intro:
        "Manual backups are often inconsistent. Automation helps ensure critical data remains protected.",
      checklist: [
        { item: "Schedule backups automatically." },
        { item: "Monitor backup completion." },
        { item: "Receive alerts for failures." },
      ],
    },
    {
      title: "Backup Best Practice 2: Back Up Microsoft 365 Data",
      intro:
        "Many organisations assume Microsoft automatically backs up all Microsoft 365 content indefinitely. While Microsoft provides service resilience, organisations remain responsible for protecting business data.",
      checklist: [
        { item: "Protect Exchange Online mailboxes." },
        { item: "Protect SharePoint sites." },
        { item: "Protect OneDrive data." },
        { item: "Protect Teams content." },
        { item: "Consider third-party backup solutions to enhance Microsoft 365 protection." },
      ],
    },
    {
      title: "Backup Best Practice 3: Maintain Offsite or Offline Copies",
      intro:
        "Ransomware can encrypt connected storage systems, so recoverable backup copies should be isolated from production environments.",
      checklist: [
        { item: "Store backup copies offsite." },
        { item: "Use immutable storage where available." },
        { item: "Maintain offline backup copies." },
      ],
    },
    {
      title: "Backup Best Practice 4: Encrypt Backup Data",
      intro:
        "Backup repositories often contain sensitive business information, so backup security should match the importance of the data being protected.",
      checklist: [
        { item: "Encrypt backups at rest." },
        { item: "Encrypt backups during transfer." },
        { item: "Restrict administrative access." },
      ],
    },
    {
      title: "Backup Best Practice 5: Monitor Backup Jobs",
      intro:
        "Backup monitoring helps identify failures before recovery is needed.",
      checklist: [
        { item: "Review backup success rates." },
        { item: "Investigate failed jobs." },
        { item: "Track storage capacity." },
        { item: "Validate retention periods." },
      ],
      callout: {
        type: "warning",
        body: "Successful backups should never be assumed.",
      },
    },
    {
      title: "Why Recovery Testing Is Essential",
      intro:
        "Many organisations discover backup problems only when recovery is required. Testing confirms recovery processes actually work.",
      checklist: [
        { item: "Confirm data can be restored successfully." },
        { item: "Verify recovery times are achievable." },
        { item: "Confirm backup configurations remain valid." },
        { item: "Ensure staff understand recovery procedures." },
        { item: "Document test results and review them regularly." },
      ],
    },
    {
      title: "Recommended Recovery Testing",
      intro:
        "Testing should cover individual files, Microsoft 365 data, servers and broader disaster recovery scenarios.",
      checklist: [
        { item: "File Recovery: restore individual files and folders." },
        { item: "Email Recovery: recover mailboxes or messages." },
        { item: "Server Recovery: test virtual machine or server restoration." },
        { item: "Disaster Recovery Scenarios: validate complete business recovery procedures." },
      ],
    },
    {
      title: "Backup Security Considerations",
      intro:
        "Backup systems should be protected from unauthorised access, malware, ransomware and credential compromise.",
      checklist: [
        { item: "Use Multi-Factor Authentication." },
        { item: "Apply role-based access controls." },
        { item: "Separate administrative accounts." },
        { item: "Enable logging and monitoring." },
        { item: "Review backup system access regularly." },
      ],
      callout: {
        type: "warning",
        body: "Compromised backup systems may prevent successful recovery.",
      },
    },
  ],
  extraSections: [
    {
      title: "Common Backup Mistakes",
      checklist: [
        { item: "Never testing restorations." },
        { item: "Storing all backups in one location." },
        { item: "Ignoring failed backup jobs." },
        { item: "Relying on a single backup method." },
        { item: "Retaining backups for insufficient periods." },
        { item: "Failing to document recovery procedures." },
        { item: "Avoiding these mistakes improves resilience and recovery readiness." },
      ],
    },
    {
      title: "Signs Your Backup Strategy Needs Review",
      checklist: [
        { item: "Recovery procedures are undocumented." },
        { item: "Backup failures are occurring regularly." },
        { item: "Testing has not been performed recently." },
        { item: "Microsoft 365 data is not protected." },
        { item: "Recovery objectives are unclear." },
        { item: "Storage capacity is approaching limits." },
      ],
    },
    {
      title: "Security and Compliance Considerations",
      checklist: [
        { item: "Essential Eight compliance." },
        { item: "Cyber insurance requirements." },
        { item: "Business continuity planning." },
        { item: "Risk management frameworks." },
        { item: "Regulatory obligations." },
        { item: "Backups are often a foundational component of broader cyber security strategies." },
      ],
    },
    {
      title: "When to Contact Support",
      checklist: [
        { item: "Backups are failing." },
        { item: "Recovery objectives are unclear." },
        { item: "Microsoft 365 protection requires review." },
        { item: "Recovery testing has not been performed recently." },
        { item: "Storage capacity issues are occurring." },
        { item: "You need assistance validating restoration procedures." },
        {
          item: "Providing details about your backup environment and recent failures will help accelerate troubleshooting.",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Backup Jobs Are Failing",
      content:
        "Review backup logs, storage availability, credentials, network connectivity and recent configuration changes. Failed backup jobs should be investigated promptly.",
    },
    {
      title: "Recovery Testing Has Not Been Performed Recently",
      content:
        "Schedule a controlled restoration test for files, email, applications or systems based on business criticality. Document the outcome and address any gaps.",
    },
    {
      title: "Microsoft 365 Data Is Not Protected",
      content:
        "Microsoft provides platform resilience, but organisations remain responsible for protecting Exchange Online, SharePoint, OneDrive and Teams data. Review whether a dedicated Microsoft 365 backup solution is required.",
    },
    {
      title: "Storage Capacity Is Approaching Limits",
      content:
        "Review retention periods, backup growth trends and protected workloads. Capacity issues can cause backup failures and reduce recovery options.",
    },
  ],
  bestPracticeTips: [
    { title: "Automate backups", icon: "clock" },
    { title: "Use the 3-2-1 backup rule", icon: "grid-2x2" },
    { title: "Test restorations regularly", icon: "check-circle" },
    { title: "Protect Microsoft 365 data", icon: "cloud" },
    { title: "Encrypt backup data", icon: "lock" },
    {
      title: "Monitor backup jobs",
      body: "Review failures, success rates, capacity and retention so recovery issues are found early.",
      icon: "monitor",
    },
  ],
  faqs: [
    {
      question: "How often should backups run?",
      answer:
        "The appropriate frequency depends on business requirements and acceptable data loss thresholds.",
    },
    {
      question: "Are cloud services automatically backed up?",
      answer:
        "Not always. Organisations remain responsible for ensuring business data is adequately protected.",
    },
    {
      question: "How often should recovery testing occur?",
      answer:
        "Most organisations should perform recovery testing at least annually, with critical systems tested more frequently.",
    },
    {
      question: "Can backups protect against ransomware?",
      answer:
        "Yes. Properly designed backup systems are one of the most effective recovery mechanisms following ransomware incidents.",
    },
    {
      question: "What is the difference between backup and disaster recovery?",
      answer:
        "Backups protect data, while disaster recovery focuses on restoring systems, services and business operations.",
    },
  ],
};

const remoteWorkContent = lexicalBlocks([
  paragraphNode(
    "Remote and hybrid work have become a standard part of modern business operations. While remote work offers flexibility and productivity benefits, it also introduces new challenges related to cyber security, device management, connectivity and collaboration."
  ),
  paragraphNode(
    "Following remote work best practices helps protect company information, improve reliability and ensure employees remain productive regardless of location."
  ),
  paragraphNode(
    "This guide outlines practical recommendations for maintaining a secure and effective remote working environment."
  ),
  headingNode("Why Remote Work Best Practices Matter"),
  paragraphNode(
    "Working outside the office can expose organisations to additional risks, including unsecured home networks, public Wi-Fi threats, device theft or loss, phishing attacks, poor collaboration habits, inconsistent backup practices and reduced visibility of security incidents."
  ),
  headingNode("Secure Your Home Workspace"),
  listNode([
    "Use a dedicated workspace where possible.",
    "Lock your computer when unattended.",
    "Keep devices physically secure.",
    "Prevent unauthorised access by family members or visitors.",
    "Avoid leaving company devices in vehicles or public areas.",
  ]),
  headingNode("Use Strong Authentication"),
  listNode([
    "Use strong passwords.",
    "Enable Multi-Factor Authentication.",
    "Use Microsoft Authenticator where available.",
    "Follow secure password management practices.",
  ]),
  headingNode("Connect Securely"),
  listNode([
    "Connect to the approved VPN before accessing business systems when required.",
    "Verify the VPN connection is active.",
    "Use a VPN on public Wi-Fi where possible.",
    "Verify network names carefully.",
    "Avoid unknown wireless networks.",
  ]),
  headingNode("Protect Business Data"),
  paragraphNode(
    "Store business information only in approved locations such as OneDrive, SharePoint, Microsoft Teams or company file storage platforms. Avoid personal cloud storage services, USB drives without approval and unsecured file-sharing platforms."
  ),
  headingNode("When to Contact Support"),
  paragraphNode(
    "Contact the Genisys Service Desk if you cannot access company systems, VPN connections fail repeatedly, Microsoft Teams issues continue, devices are lost or stolen, security concerns arise or you suspect account compromise."
  ),
]);

const remoteWorkGuideLayout = {
  enabled: true,
  overview:
    "Remote and hybrid work have become a standard part of modern business operations. While remote work offers flexibility and productivity benefits, it also introduces new challenges related to cyber security, device management, connectivity and collaboration. Following remote work best practices helps protect company information, improve reliability and ensure employees remain productive regardless of location. This guide outlines practical recommendations for maintaining a secure and effective remote working environment.",
  beforeYouStart: [
    { item: "Confirm your device is company-managed or approved for work use." },
    { item: "Ensure Microsoft 365, Teams, VPN and security tools are available." },
    { item: "Keep your MFA device nearby for sign-in prompts." },
    { item: "Use approved company storage locations for business data." },
    { item: "Report lost devices, suspicious prompts or access issues promptly." },
  ],
  beforeYouStartCallout:
    "Remote work security depends on good habits, reliable connectivity and quick reporting when something looks unusual.",
  steps: [
    {
      title: "Why Remote Work Best Practices Matter",
      intro:
        "Working outside the office can expose organisations to additional risks. A proactive approach helps minimise these risks while supporting employee productivity.",
      checklist: [
        { item: "Unsecured home networks." },
        { item: "Public Wi-Fi threats." },
        { item: "Device theft or loss." },
        { item: "Phishing attacks." },
        { item: "Poor collaboration habits." },
        { item: "Inconsistent backup practices." },
        { item: "Reduced visibility of security incidents." },
      ],
      callout: {
        type: "info",
        body: "A proactive approach helps protect company information while supporting productive work from any location.",
      },
    },
    {
      title: "Secure Your Home Workspace",
      intro:
        "Physical security remains an important part of cyber security when working remotely.",
      checklist: [
        { item: "Use a dedicated workspace where possible." },
        { item: "Lock your computer when unattended." },
        { item: "Keep devices physically secure." },
        { item: "Prevent unauthorised access by family members or visitors." },
        { item: "Avoid leaving company devices in vehicles or public areas." },
      ],
    },
    {
      title: "Use Strong Authentication",
      intro:
        "Always protect business accounts with strong authentication controls. MFA significantly reduces the risk of account compromise.",
      checklist: [
        { item: "Use strong passwords." },
        { item: "Enable Multi-Factor Authentication." },
        { item: "Use Microsoft Authenticator where available." },
        { item: "Follow secure password management practices." },
      ],
      infoCards: [
        {
          title: "MFA protection",
          body: "MFA helps protect accounts even if a password is compromised.",
          icon: "shield-check",
        },
        {
          title: "Authenticator app",
          body: "Microsoft Authenticator is recommended for secure sign-in approvals.",
          icon: "smartphone",
        },
      ],
    },
    {
      title: "Connect Securely",
      intro:
        "Use approved remote access methods and treat public networks as untrusted.",
      checklist: [
        { item: "Connect to the approved VPN before accessing business systems when required." },
        { item: "Verify the VPN connection is active." },
        { item: "Disconnect when work is completed if instructed." },
        { item: "Use a VPN on public Wi-Fi where possible." },
        { item: "Verify network names carefully." },
        { item: "Avoid unknown wireless networks." },
      ],
      callout: {
        type: "warning",
        body: "Avoid accessing sensitive systems from public Wi-Fi without appropriate security controls.",
      },
    },
    {
      title: "Keep Devices Updated",
      intro:
        "Outdated devices are a common source of security vulnerabilities.",
      checklist: [
        { item: "Install Windows or macOS updates." },
        { item: "Update Microsoft 365 applications." },
        { item: "Keep browsers current." },
        { item: "Confirm security software remains active." },
        { item: "Enable automatic updates where possible." },
      ],
    },
    {
      title: "Protect Business Data",
      intro:
        "Approved storage locations improve security, collaboration and backup coverage.",
      checklist: [
        { item: "Store business information in OneDrive." },
        { item: "Use SharePoint for team and department files." },
        { item: "Use Microsoft Teams for collaboration files." },
        { item: "Use approved company file storage platforms." },
        { item: "Avoid personal cloud storage services." },
        { item: "Avoid USB drives without approval." },
        { item: "Avoid unsecured file-sharing platforms." },
      ],
    },
    {
      title: "Be Alert to Phishing Attempts",
      intro:
        "Remote workers are frequently targeted by phishing campaigns.",
      checklist: [
        { item: "Verify unexpected emails." },
        { item: "Check links before clicking." },
        { item: "Confirm unusual payment requests." },
        { item: "Report suspicious messages." },
        { item: "Verify unusual requests through another communication channel." },
      ],
      callout: {
        type: "warning",
        body: "If something seems unusual, verify through another trusted communication channel before acting.",
      },
    },
    {
      title: "Optimise Your Home Network",
      intro:
        "Reliable connectivity improves productivity and call quality.",
      checklist: [
        { item: "Change default router passwords." },
        { item: "Enable modern encryption such as WPA2 or WPA3." },
        { item: "Install router firmware updates." },
        { item: "Disable unnecessary router services." },
        { item: "Position routers centrally." },
        { item: "Use wired connections where possible." },
        { item: "Minimise wireless interference." },
        { item: "Restart networking equipment periodically." },
      ],
    },
    {
      title: "Best Practices for Microsoft Teams",
      intro:
        "Microsoft Teams is often the primary communication platform for remote workers.",
      checklist: [
        { item: "Before meetings: test audio devices, verify camera operation, confirm internet stability and join a few minutes early." },
        { item: "During meetings: mute when not speaking, use a headset where possible, minimise background noise and keep meeting etiquette professional." },
        { item: "After meetings: store files in Teams or SharePoint, follow up on action items and update tasks or project information." },
      ],
      screenshotPlaceholder: {
        enabled: true,
        label: "Screenshot placeholder: Teams meeting device check",
        icon: "message-circle",
      },
    },
    {
      title: "Maintain Device Performance",
      intro:
        "Small maintenance tasks can prevent larger reliability problems.",
      checklist: [
        { item: "Restart devices regularly." },
        { item: "Close unused applications." },
        { item: "Monitor storage capacity." },
        { item: "Remove unnecessary software." },
        { item: "Report recurring issues promptly." },
      ],
    },
    {
      title: "Backup Important Information",
      intro:
        "Business-critical information should be stored within approved company systems that are backed up and protected.",
      checklist: [
        { item: "Avoid saving important files exclusively on desktop folders." },
        { item: "Avoid saving important files exclusively on local drives." },
        { item: "Avoid saving important files exclusively on personal devices." },
        { item: "Use cloud-based collaboration platforms to improve resilience and recovery." },
      ],
    },
    {
      title: "Security Best Practices for Travelling",
      intro:
        "Travelling users face additional physical and cyber security risks.",
      checklist: [
        { item: "Keep devices with you." },
        { item: "Use privacy screens where appropriate." },
        { item: "Avoid leaving devices unattended." },
        { item: "Be cautious when using public charging stations." },
        { item: "Report lost or stolen devices immediately." },
      ],
    },
  ],
  extraSections: [
    {
      title: "When to Contact Support",
      checklist: [
        { item: "You cannot access company systems." },
        { item: "VPN connections fail repeatedly." },
        { item: "Microsoft Teams issues continue." },
        { item: "Devices are lost or stolen." },
        { item: "Security concerns arise." },
        { item: "You suspect account compromise." },
        { item: "Providing screenshots and detailed descriptions will assist with faster troubleshooting." },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Slow Internet Connections",
      content:
        "Restart networking equipment, reduce network congestion, use a wired connection where possible and contact your internet provider if performance remains poor.",
    },
    {
      title: "Teams Call Quality Issues",
      content:
        "Check internet speed, headset quality, device performance and whether your organisation requires VPN for the service you are accessing.",
    },
    {
      title: "Unable to Access Company Resources",
      content:
        "Verify VPN connectivity, internet access, account permissions and MFA completion before escalating to support.",
    },
    {
      title: "Device Performance Problems",
      content:
        "Review available storage, pending updates, running applications, and the age and health of the device. Report recurring performance issues promptly.",
    },
  ],
  bestPracticeTips: [
    { title: "Use MFA for business accounts", icon: "shield-check" },
    { title: "Keep devices updated", icon: "check-circle" },
    { title: "Use approved cloud storage", icon: "cloud" },
    { title: "Connect securely with VPN when required", icon: "wifi" },
    { title: "Use a headset for Teams meetings", icon: "headphones" },
    {
      title: "Report lost devices immediately",
      body: "Quick reporting helps support teams protect company data and accounts.",
      icon: "shield-alert",
    },
  ],
  faqs: [
    {
      question: "Can I use my personal computer for work?",
      answer:
        "This depends on your organisation's policies. Company-managed devices are generally preferred for security and compliance reasons.",
    },
    {
      question: "Is public Wi-Fi safe?",
      answer:
        "Public Wi-Fi should be treated as untrusted. Use a VPN and avoid sensitive activities where possible.",
    },
    {
      question: "Why is MFA important when working remotely?",
      answer:
        "MFA helps protect accounts from compromise, particularly when users access services from multiple locations.",
    },
    {
      question: "What should I do if my work device is lost or stolen?",
      answer:
        "Report the incident immediately to your IT support team.",
    },
    {
      question: "Should I leave my VPN connected all day?",
      answer:
        "Follow your organisation's VPN and remote access policies.",
    },
  ],
};

const newStarterItAccessContent = lexicalBlocks([
  paragraphNode(
    "Starting a new employee involves more than simply providing a laptop and email account. Proper onboarding ensures new team members have the correct access, devices, security settings and support resources from day one."
  ),
  paragraphNode(
    "This checklist helps managers, HR teams and employees confirm that all essential IT requirements have been completed before a new starter begins work."
  ),
  headingNode("Before the Employee Starts"),
  paragraphNode(
    "The employee's details, access requirements and device requirements should be provided to your IT team at least 3-5 business days before the employee's commencement date."
  ),
  listNode([
    "Full name, job title, department, manager, location or remote worker status, start date and contact phone number.",
    "Required access to Microsoft 365, Teams, SharePoint, OneDrive, line of business applications, VPN, shared mailboxes and distribution groups.",
    "Required devices such as laptop, monitors, docking station, keyboard, mouse, headset, mobile phone, security token or MFA device.",
  ]),
  headingNode("Account Setup Checklist"),
  listNode([
    "Microsoft 365 user account created and licence assigned.",
    "Email mailbox, Teams access, OneDrive and SharePoint permissions configured.",
    "Multi-Factor Authentication enabled, strong password assigned and Conditional Access policies applied.",
    "Security groups, endpoint protection and device management enrolment completed.",
  ]),
  headingNode("Device Preparation Checklist"),
  listNode([
    "Operating system updated and security patches installed.",
    "Endpoint protection, encryption, Microsoft 365 applications and required business applications installed.",
    "Printer mappings, VPN configuration and device testing completed where required.",
  ]),
  headingNode("First Day Verification"),
  listNode([
    "User can sign in, send and receive email, access shared mailboxes, sign into Teams and join meetings.",
    "OneDrive, SharePoint, department shared folders and required business applications are available.",
    "Licensing, permissions and remote worker requirements have been confirmed.",
  ]),
  headingNode("Need Assistance?"),
  paragraphNode(
    "If you require assistance with onboarding a new employee or provisioning access, please contact the Genisys Service Desk. Providing onboarding requests several business days before the employee's start date helps ensure a smooth and productive first day."
  ),
]);

const newStarterItAccessGuideLayout = {
  enabled: true,
  overview:
    "Starting a new employee involves more than simply providing a laptop and email account. Proper onboarding ensures new team members have the correct access, devices, security settings and support resources from day one. This checklist helps managers, HR teams and employees confirm that all essential IT requirements have been completed before a new starter begins work.",
  beforeYouStart: [
    { item: "Provide onboarding details to IT at least 3-5 business days before the employee's commencement date." },
    { item: "Confirm the employee's role, department, manager, start date and work location." },
    { item: "Identify required systems, applications, shared mailboxes, distribution groups and remote access needs." },
    { item: "Confirm required devices, accessories, mobile equipment and MFA requirements." },
    { item: "Collect manager approval for any specialised applications or privileged access." },
  ],
  beforeYouStartCallout:
    "Early onboarding requests give IT teams enough time to provision access, prepare devices and resolve licensing or approval issues before the employee's first day.",
  steps: [
    {
      title: "Before the Employee Starts",
      intro:
        "The following details should be provided to your IT team before the employee starts so accounts, devices and permissions can be prepared.",
      checklist: [
        { item: "Employee details: full name, job title, department, manager's name, office location or remote worker status, employment start date and contact phone number." },
        { item: "Access requirements: Microsoft 365, Email, Teams, SharePoint, OneDrive, line of business applications, CRM, finance systems, HR platforms, VPN, Remote Desktop, shared mailboxes, distribution groups and security platforms." },
        { item: "Device requirements: laptop or desktop computer, monitors, docking station, keyboard and mouse, headset, mobile phone, security token or MFA device, and printer access." },
      ],
      infoCards: [
        {
          title: "Employee details",
          body: "Provide the full identity, department, manager and start date information required to create the account correctly.",
          icon: "info",
        },
        {
          title: "Access requirements",
          body: "Confirm the business systems, Microsoft 365 services, groups and remote access the user needs.",
          icon: "lock",
        },
        {
          title: "Device requirements",
          body: "Confirm the hardware, accessories and security devices needed for the role.",
          icon: "monitor",
        },
      ],
    },
    {
      title: "Account Setup Checklist",
      intro:
        "Verify the Microsoft 365 account and security configuration have been completed before the user signs in.",
      checklist: [
        { item: "User account created." },
        { item: "Microsoft 365 licence assigned." },
        { item: "Email mailbox created." },
        { item: "Teams access enabled." },
        { item: "OneDrive provisioned." },
        { item: "SharePoint permissions assigned." },
        { item: "Multi-Factor Authentication enabled." },
        { item: "Strong password assigned." },
        { item: "Conditional Access policies applied." },
        { item: "Security groups assigned." },
        { item: "Endpoint protection installed." },
        { item: "Device enrolled into the management platform." },
      ],
      callout: {
        type: "info",
        body: "Group membership and licence assignment are common causes of missing access on day one, so confirm both before the employee starts.",
      },
    },
    {
      title: "Device Preparation Checklist",
      intro:
        "Before issuing a device, confirm it is updated, protected, encrypted and ready for the user's required applications.",
      checklist: [
        { item: "Operating system fully updated." },
        { item: "Security patches installed." },
        { item: "Endpoint protection installed." },
        { item: "Device encryption enabled." },
        { item: "Microsoft 365 applications installed." },
        { item: "Required business applications installed." },
        { item: "Printer mappings configured." },
        { item: "VPN configured if required." },
        { item: "Device tested and verified." },
      ],
    },
    {
      title: "First Day Verification",
      intro:
        "On the employee's first day, confirm the core services they need for productive work are operating correctly.",
      checklist: [
        { item: "User can sign in successfully." },
        { item: "Email sending and receiving works." },
        { item: "Shared mailboxes are accessible." },
        { item: "Teams login is successful." },
        { item: "Team memberships are assigned." },
        { item: "Meetings can be joined." },
        { item: "OneDrive is accessible." },
        { item: "SharePoint sites are accessible." },
        { item: "Department shared folders are accessible." },
        { item: "Required applications launch correctly." },
        { item: "User permissions and licensing are confirmed." },
      ],
    },
    {
      title: "Remote Worker Setup",
      intro:
        "For remote or hybrid employees, validate secure access, collaboration tools and remote support before they begin working independently.",
      checklist: [
        { item: "VPN access tested." },
        { item: "Home internet connection verified." },
        { item: "MFA setup completed." },
        { item: "Teams audio and video tested." },
        { item: "Remote support tools installed." },
        { item: "Device management enrolment confirmed." },
      ],
      callout: {
        type: "warning",
        body: "Remote users should test sign-in, MFA, Teams and VPN before their first working session to avoid access delays.",
      },
    },
    {
      title: "Security Best Practices",
      intro:
        "All new employees should understand the core security habits expected when using company systems and data.",
      checklist: [
        { item: "Use unique passwords and avoid password sharing." },
        { item: "Use a password manager where approved." },
        { item: "Report suspected account compromise immediately." },
        { item: "Complete security awareness training." },
        { item: "Learn how to recognise phishing emails, malicious links, social engineering attempts and business email compromise." },
        { item: "Follow company data handling requirements." },
      ],
      infoCards: [
        {
          title: "Multi-Factor Authentication",
          body: "MFA provides an additional layer of protection by requiring a second form of verification during sign-in.",
          icon: "shield-check",
        },
        {
          title: "Security awareness",
          body: "Training helps new employees recognise phishing, unsafe links, social engineering and data handling risks.",
          icon: "shield-alert",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      title: "Unable to Sign In",
      content:
        "Check the username, password, MFA configuration and account lock status. Confirm the user account is active and the correct licence has been assigned.",
    },
    {
      title: "Email Not Working",
      content:
        "Confirm the Microsoft 365 licence is assigned, the mailbox has been provisioned successfully and the device has internet access.",
    },
    {
      title: "Missing Application Access",
      content:
        "Check security group membership, licence assignment and manager approval. Some applications may require additional provisioning time.",
    },
  ],
  bestPracticeTips: [
    {
      title: "Submit onboarding requests early",
      body: "Provide new starter details several business days before the start date.",
      icon: "clock",
    },
    {
      title: "Confirm manager approvals",
      body: "Specialised systems, shared mailboxes and privileged access may require approval.",
      icon: "check-circle",
    },
    {
      title: "Enable MFA before first sign-in",
      body: "MFA protects the new user's account from the first day of access.",
      icon: "shield-check",
    },
    {
      title: "Test the device before handover",
      body: "Verify updates, encryption, security tools, VPN and core applications.",
      icon: "monitor",
    },
    {
      title: "Validate first-day access",
      body: "Confirm email, Teams, OneDrive, SharePoint and required business applications work.",
      icon: "cloud",
    },
    {
      title: "Report issues promptly",
      body: "Early reporting helps IT resolve account, licence or permission gaps quickly.",
      icon: "message-circle",
    },
  ],
  faqs: [
    {
      question: "How early should IT receive new starter details?",
      answer:
        "Provide details at least 3-5 business days before the employee's commencement date so accounts, devices and access can be prepared.",
    },
    {
      question: "Who approves application access?",
      answer:
        "Access is usually approved by the employee's manager, department owner or system owner depending on the application and permission level.",
    },
    {
      question: "What if access is missing on the first day?",
      answer:
        "Confirm the licence, security group membership and manager approval, then contact the Genisys Service Desk with the affected user and system details.",
    },
    {
      question: "Is MFA required for new starters?",
      answer:
        "Most organisations require MFA to protect Microsoft 365, VPN and other business systems from unauthorised access.",
    },
    {
      question: "What should remote workers test before starting?",
      answer:
        "Remote workers should test MFA, VPN, Teams audio and video, device management enrolment and access to required business applications.",
    },
  ],
};

const articles = [
  {
    title: "How to Set Up Multi-Factor Authentication (MFA)",
    slug: "how-to-set-up-multi-factor-authentication-mfa",
    categorySlug: "cyber-security",
    summary:
      "Register and manage multi-factor authentication for your Microsoft 365 account.",
    tags: ["MFA", "Microsoft 365", "Security"],
    popularArticle: true,
    estimatedReadTime: 6,
    publishedAt: "2024-05-02T00:00:00.000Z",
    guideLayout: mfaGuideLayout,
    relatedArticleSlugs: [
      "what-to-do-if-you-receive-a-phishing-email",
      "microsoft-365-mfa-new-registration-process",
      "outlook-not-syncing-try-these-fixes",
      "vpn-connection-setup-windows-11",
      "teams-calling-quick-start-guide",
    ],
  },
  {
    title: "Teams Calling - Quick Start Guide",
    slug: "teams-calling-quick-start-guide",
    categorySlug: "connectivity-voice",
    summary:
      "Make and receive calls, manage voicemail and configure Teams Calling.",
    tags: ["Teams Calling", "VoIP", "Microsoft 365"],
    popularArticle: true,
    estimatedReadTime: 5,
    publishedAt: "2024-04-30T00:00:00.000Z",
    guideLayout: teamsCallingGuideLayout,
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "teams-calling-migration-important-updates",
      "outlook-not-syncing-try-these-fixes",
      "vpn-connection-setup-windows-11",
      "what-to-do-if-you-receive-a-phishing-email",
    ],
  },
  {
    title: "Outlook Not Syncing? Try These Fixes",
    subtitle: "Troubleshoot common Outlook sync issues across desktop and mobile devices.",
    slug: "outlook-not-syncing-try-these-fixes",
    categorySlug: "microsoft-365-email-support",
    summary:
      "Troubleshoot common Outlook sync issues across desktop and mobile devices.",
    excerpt:
      "Troubleshoot Outlook sync issues across desktop and mobile devices, including offline mode, service health, mailbox sync, updates and profile rebuilds.",
    content: outlookArticleContent,
    seo: {
      title: "Outlook Not Syncing? Try These Fixes | Genisys Support",
      description:
        "Troubleshoot common Outlook sync issues across desktop and mobile devices with Genisys Support guidance for Microsoft 365 email users.",
    },
    tags: ["Outlook", "Microsoft 365", "Email Support"],
    popularArticle: true,
    estimatedReadTime: 4,
    publishedAt: "2024-04-29T00:00:00.000Z",
    guideLayout: outlookGuideLayout,
    relatedArticleSlugs: [
      "microsoft-365-mfa-new-registration-process",
      "how-to-set-up-multi-factor-authentication-mfa",
      "teams-calling-quick-start-guide",
    ],
  },
  {
    title: "VPN Connection Setup - Windows 11",
    subtitle: "Connect securely to business resources using the Genisys-managed VPN profile.",
    slug: "vpn-connection-setup-windows-11",
    categorySlug: "vpn-remote-access",
    summary:
      "Connect securely to business resources using the Genisys-managed VPN profile.",
    excerpt:
      "Learn how to connect to a Genisys-managed VPN on Windows 11, verify secure remote access and troubleshoot common VPN issues.",
    content: vpnArticleContent,
    difficulty: "easy",
    appliesTo: ["Windows 11"],
    seo: {
      title: "VPN Connection Setup for Windows 11 | Genisys Support",
      description:
        "Learn how to connect to a Genisys-managed VPN on Windows 11. Follow step-by-step instructions for secure remote access and troubleshooting common VPN issues.",
      primaryKeyword: "VPN Connection Setup Windows 11",
      secondaryKeywords: [
        "Windows 11 VPN setup",
        "Connect to company VPN",
        "Remote access VPN",
        "VPN troubleshooting",
        "Windows VPN connection",
        "Business VPN support",
      ],
    },
    tags: [
      "VPN",
      "Windows 11",
      "Remote Access",
      "VPN Troubleshooting",
      "Business VPN Support",
    ],
    popularArticle: true,
    estimatedReadTime: 3,
    publishedAt: "2024-04-27T00:00:00.000Z",
    guideLayout: vpnGuideLayout,
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-365-mfa-new-registration-process",
      "remote-work-best-practice-guide",
      "outlook-not-syncing-try-these-fixes",
    ],
  },
  {
    title: "What to Do If You Receive a Phishing Email",
    subtitle: "Identify suspicious messages, avoid unsafe links and report phishing attempts.",
    slug: "what-to-do-if-you-receive-a-phishing-email",
    categorySlug: "cyber-security",
    summary:
      "Identify suspicious messages, avoid unsafe links and report phishing attempts.",
    excerpt:
      "Learn how to identify phishing emails, avoid malicious links, report suspicious messages and protect your Microsoft 365 account from cyber threats.",
    content: phishingArticleContent,
    seo: {
      title: "What to Do If You Receive a Phishing Email | Genisys Support",
      description:
        "Learn how to identify phishing emails, avoid malicious links, report suspicious messages and protect your Microsoft 365 account from cyber threats.",
      primaryKeyword: "Phishing Email",
      secondaryKeywords: [
        "phishing email examples",
        "phishing awareness",
        "suspicious email",
        "email security",
        "cyber security awareness",
        "Microsoft 365 phishing protection",
      ],
    },
    tags: [
      "Phishing",
      "Security Awareness",
      "Email Security",
      "Microsoft 365",
      "Cyber Security",
    ],
    popularArticle: true,
    estimatedReadTime: 5,
    publishedAt: "2024-04-26T00:00:00.000Z",
    guideLayout: phishingGuideLayout,
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-authenticator-setup-guide",
      "outlook-not-syncing-try-these-fixes",
      "vpn-connection-setup-windows-11",
      "microsoft-365-password-reset-guide",
    ],
  },
  {
    title: "Essential 8 Compliance Guide (2024)",
    subtitle:
      "Start with the key Essential Eight controls and practical steps to improve security maturity.",
    slug: "essential-8-compliance-guide-2024",
    categorySlug: "cyber-security",
    summary:
      "Start with the key Essential Eight controls and practical steps to improve security maturity.",
    excerpt:
      "Learn the ACSC Essential Eight framework, understand maturity levels and discover practical steps to improve cyber security and compliance across your organisation.",
    content: essentialEightArticleContent,
    seo: {
      title: "Essential Eight Compliance Guide (2024) | Genisys Support",
      description:
        "Learn the ACSC Essential Eight framework, understand maturity levels and discover practical steps to improve cyber security and compliance across your organisation.",
      primaryKeyword: "Essential Eight Compliance",
      secondaryKeywords: [
        "Essential Eight",
        "ACSC Essential Eight",
        "cyber security compliance",
        "Essential Eight maturity model",
        "Australian cyber security framework",
        "cyber security assessment",
      ],
    },
    tags: ["Essential Eight", "Cyber Security", "Compliance"],
    popularArticle: false,
    estimatedReadTime: 8,
    publishedAt: "2024-05-02T12:00:00.000Z",
    guideLayout: essentialEightGuideLayout,
    articleCTA: {
      enabled: true,
      headline: "Assess Your Essential Eight Maturity",
      description:
        "Not sure where your organisation stands? Complete the Genisys Essential Eight Assessment and receive guidance on improving your cyber security posture.",
      primaryButton: {
        label: "Start Assessment",
        url: "#essential-eight-assessment",
      },
      secondaryButton: {
        label: "Book a Security Consultation",
        url: "tel:1300220888",
      },
    },
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "what-to-do-if-you-receive-a-phishing-email",
      "vpn-connection-setup-windows-11",
      "microsoft-authenticator-setup-guide",
      "backup-and-recovery-best-practices",
    ],
  },
  {
    title: "Teams Calling Migration - Important Updates",
    subtitle: "Review important Teams Calling migration changes, timing and user impact.",
    slug: "teams-calling-migration-important-updates",
    categorySlug: "connectivity-voice",
    summary:
      "Review important Teams Calling migration changes, timing and user impact.",
    excerpt:
      "Learn what to expect during a Microsoft Teams Calling migration, including timelines, user impact, testing steps, troubleshooting and post-migration support.",
    content: teamsCallingMigrationContent,
    seo: {
      title: "Teams Calling Migration - Important Updates | Genisys Support",
      description:
        "Learn what to expect during a Microsoft Teams Calling migration, including timelines, user impact, testing steps, troubleshooting and post-migration support.",
      primaryKeyword: "Teams Calling Migration",
      secondaryKeywords: [
        "Microsoft Teams Calling",
        "Teams Phone migration",
        "Teams phone system",
        "business phone migration",
        "Microsoft Teams telephony",
        "Teams Calling support",
      ],
    },
    tags: [
      "Teams Calling",
      "Migration",
      "VoIP",
      "Microsoft Teams",
      "Teams Phone",
    ],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-30T12:00:00.000Z",
    guideLayout: teamsCallingMigrationGuideLayout,
    relatedArticleSlugs: [
      "teams-calling-quick-start-guide",
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-teams-audio-device-troubleshooting",
      "vpn-connection-setup-windows-11",
      "outlook-not-syncing-try-these-fixes",
    ],
  },
  {
    title: "Microsoft 365 MFA - New Registration Process",
    subtitle: "Understand the updated MFA registration flow for Microsoft 365 accounts.",
    slug: "microsoft-365-mfa-new-registration-process",
    categorySlug: "cloud-microsoft-365",
    summary:
      "Understand the updated MFA registration flow for Microsoft 365 accounts.",
    excerpt:
      "Learn how Microsoft's updated MFA registration process works, how to register Microsoft Authenticator, complete verification and troubleshoot common issues.",
    content: mfaRegistrationArticleContent,
    seo: {
      title: "Microsoft 365 MFA New Registration Process | Genisys Support",
      description:
        "Learn how Microsoft's updated MFA registration process works, how to register Microsoft Authenticator, complete verification and troubleshoot common issues.",
      primaryKeyword: "Microsoft 365 MFA Registration",
      secondaryKeywords: [
        "Microsoft Authenticator setup",
        "MFA registration process",
        "Microsoft 365 security",
        "MFA onboarding",
        "Microsoft number matching",
        "Microsoft account protection",
      ],
    },
    tags: ["MFA", "Microsoft 365", "Security"],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-28T12:00:00.000Z",
    guideLayout: mfaRegistrationGuideLayout,
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-authenticator-setup-guide",
      "what-to-do-if-you-receive-a-phishing-email",
      "microsoft-365-password-reset-guide",
      "vpn-connection-setup-windows-11",
    ],
  },
  {
    title: "Microsoft Authenticator Setup Guide",
    subtitle:
      "Set up Microsoft Authenticator for secure Microsoft 365 sign-ins and MFA approvals.",
    slug: "microsoft-authenticator-setup-guide",
    categorySlug: "cyber-security",
    summary:
      "Set up Microsoft Authenticator for secure Microsoft 365 sign-ins and MFA approvals.",
    excerpt:
      "Learn how to install Microsoft Authenticator, register your Microsoft 365 account, approve MFA requests and troubleshoot common authentication issues.",
    content: authenticatorSetupContent,
    seo: {
      title: "Microsoft Authenticator Setup Guide | Genisys Support",
      description:
        "Learn how to install Microsoft Authenticator, register your Microsoft 365 account, approve MFA requests and troubleshoot common authentication issues.",
      primaryKeyword: "Microsoft Authenticator Setup",
      secondaryKeywords: [
        "Microsoft Authenticator",
        "Microsoft MFA setup",
        "Microsoft 365 authentication",
        "MFA registration",
        "Authenticator app setup",
        "Microsoft account security",
      ],
    },
    tags: ["Microsoft Authenticator", "MFA", "Microsoft 365", "Security"],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-27T12:00:00.000Z",
    guideLayout: authenticatorSetupGuideLayout,
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-365-mfa-new-registration-process",
      "what-to-do-if-you-receive-a-phishing-email",
      "microsoft-365-password-reset-guide",
      "essential-8-compliance-guide-2024",
    ],
  },
  {
    title: "Microsoft 365 Password Reset Guide",
    subtitle:
      "Reset your Microsoft 365 password safely when it is forgotten, expired or suspected to be compromised.",
    slug: "microsoft-365-password-reset-guide",
    categorySlug: "cloud-microsoft-365",
    summary:
      "Reset your Microsoft 365 password safely when it is forgotten, expired or suspected to be compromised.",
    excerpt:
      "Learn how to safely reset your Microsoft 365 password, verify your identity, update devices and recover access to Outlook, Teams and Microsoft 365 services.",
    content: passwordResetContent,
    seo: {
      title: "Microsoft 365 Password Reset Guide | Genisys Support",
      description:
        "Learn how to safely reset your Microsoft 365 password, verify your identity, update devices and recover access to Outlook, Teams and Microsoft 365 services.",
      primaryKeyword: "Microsoft 365 Password Reset",
      secondaryKeywords: [
        "reset Microsoft password",
        "Microsoft 365 account recovery",
        "password reset guide",
        "Microsoft account security",
        "password recovery",
        "Microsoft 365 login issues",
      ],
    },
    tags: ["Microsoft 365", "Password Reset", "Account Security"],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-27T06:00:00.000Z",
    guideLayout: passwordResetGuideLayout,
    relatedArticleSlugs: [
      "microsoft-authenticator-setup-guide",
      "microsoft-365-mfa-new-registration-process",
      "how-to-set-up-multi-factor-authentication-mfa",
      "what-to-do-if-you-receive-a-phishing-email",
      "essential-8-compliance-guide-2024",
    ],
  },
  {
    title: "Microsoft Teams Audio Device Troubleshooting",
    subtitle: "Fix common Teams headset, speaker, microphone and audio permission issues.",
    slug: "microsoft-teams-audio-device-troubleshooting",
    categorySlug: "connectivity-voice",
    summary:
      "Fix common Teams headset, speaker, microphone and audio permission issues.",
    excerpt:
      "Fix Microsoft Teams headset, microphone and speaker issues. Learn how to troubleshoot audio devices, permissions, Bluetooth connections and call quality problems.",
    content: teamsAudioDeviceTroubleshootingContent,
    seo: {
      title: "Microsoft Teams Audio Device Troubleshooting | Genisys Support",
      description:
        "Fix Microsoft Teams headset, microphone and speaker issues. Learn how to troubleshoot audio devices, permissions, Bluetooth connections and call quality problems.",
      primaryKeyword: "Teams Audio Troubleshooting",
      secondaryKeywords: [
        "Teams microphone not working",
        "Teams headset issues",
        "Teams speaker problems",
        "Microsoft Teams audio settings",
        "Teams Bluetooth headset",
        "Teams call quality",
      ],
    },
    tags: ["Microsoft Teams", "Audio Devices", "Headset", "Teams Calling"],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-26T18:00:00.000Z",
    guideLayout: teamsAudioDeviceTroubleshootingGuideLayout,
    relatedArticleSlugs: [
      "teams-calling-quick-start-guide",
      "teams-calling-migration-important-updates",
      "microsoft-authenticator-setup-guide",
      "vpn-connection-setup-windows-11",
      "outlook-not-syncing-try-these-fixes",
    ],
  },
  {
    title: "Backup and Recovery Best Practices",
    subtitle:
      "Protect critical data with reliable backups, tested restorations and clear recovery processes.",
    slug: "backup-and-recovery-best-practices",
    categorySlug: "cyber-security",
    summary:
      "Protect critical data with reliable backups, tested restorations and clear recovery processes.",
    excerpt:
      "Learn backup and recovery best practices to improve business continuity, reduce ransomware risk and ensure critical data can be restored when needed.",
    content: backupRecoveryContent,
    seo: {
      title: "Backup and Recovery Best Practices | Genisys Support",
      description:
        "Learn backup and recovery best practices to improve business continuity, reduce ransomware risk and ensure critical data can be restored when needed.",
      primaryKeyword: "Backup and Recovery Best Practices",
      secondaryKeywords: [
        "business backup strategy",
        "ransomware recovery",
        "Microsoft 365 backup",
        "disaster recovery planning",
        "data protection",
        "backup testing",
      ],
    },
    tags: [
      "Backups",
      "Recovery",
      "Cyber Security",
      "Ransomware",
      "Disaster Recovery",
      "Microsoft 365 Backup",
    ],
    popularArticle: false,
    estimatedReadTime: 8,
    publishedAt: "2024-04-25T18:00:00.000Z",
    guideLayout: backupRecoveryGuideLayout,
    articleCTA: {
      enabled: true,
      headline: "Is Your Backup Strategy Ready for Recovery?",
      description:
        "Protect critical business data and validate your recovery processes with a Genisys Backup Health Check.",
      primaryButton: {
        label: "Book a Backup Review",
        url: "https://www.genisys.com.au/contact/",
      },
      secondaryButton: {
        label: "Speak to an Expert",
        url: "https://www.genisys.com.au/contact/",
      },
    },
    relatedArticleSlugs: [
      "essential-8-compliance-guide-2024",
      "what-to-do-if-you-receive-a-phishing-email",
      "microsoft-365-password-reset-guide",
      "microsoft-authenticator-setup-guide",
      "security-advisory-april-2024",
    ],
  },
  {
    title: "Security Advisory - April 2024",
    subtitle: "Review the latest security advisory and recommended actions for April 2024.",
    slug: "security-advisory-april-2024",
    categorySlug: "cyber-security",
    summary:
      "Review the latest security advisory and recommended actions for April 2024.",
    excerpt:
      "Review the latest cyber security advisory, understand emerging threats and learn practical steps to improve security and reduce organisational risk.",
    appliesTo: ["All Users"],
    content: securityAdvisoryAprilContent,
    seo: {
      title: "Security Advisory - April 2024 | Genisys Support",
      description:
        "Review the latest cyber security advisory, understand emerging threats and learn practical steps to improve security and reduce organisational risk.",
      primaryKeyword: "Security Advisory",
      secondaryKeywords: [
        "cyber security advisory",
        "phishing awareness",
        "ransomware prevention",
        "Microsoft 365 security",
        "cyber security best practices",
        "security recommendations",
      ],
    },
    tags: [
      "Security Advisory",
      "Cyber Security",
      "Phishing Awareness",
      "Ransomware Prevention",
      "Microsoft 365 Security",
    ],
    popularArticle: false,
    estimatedReadTime: 5,
    publishedAt: "2024-04-01T00:00:00.000Z",
    guideLayout: securityAdvisoryAprilGuideLayout,
    relatedArticleSlugs: [
      "what-to-do-if-you-receive-a-phishing-email",
      "microsoft-authenticator-setup-guide",
      "microsoft-365-password-reset-guide",
      "essential-8-compliance-guide-2024",
      "microsoft-365-mfa-new-registration-process",
    ],
  },
  {
    title: "Remote Work Best Practice Guide",
    subtitle: "Improve remote work security, device reliability and collaboration habits.",
    slug: "remote-work-best-practice-guide",
    categorySlug: "managed-it-services",
    summary:
      "Improve remote work security, device reliability and collaboration habits.",
    excerpt:
      "Learn remote work best practices to improve security, productivity and collaboration while protecting business systems, devices and data.",
    content: remoteWorkContent,
    seo: {
      title: "Remote Work Best Practice Guide | Genisys Support",
      description:
        "Learn remote work best practices to improve security, productivity and collaboration while protecting business systems, devices and data.",
      primaryKeyword: "Remote Work Best Practices",
      secondaryKeywords: [
        "remote work security",
        "hybrid work guide",
        "work from home best practices",
        "Microsoft Teams remote work",
        "secure remote access",
        "remote workforce security",
      ],
    },
    tags: [
      "Remote Work",
      "Managed IT",
      "Security",
      "Hybrid Work",
      "Microsoft Teams",
      "VPN",
    ],
    popularArticle: false,
    estimatedReadTime: 8,
    publishedAt: "2024-04-24T00:00:00.000Z",
    guideLayout: remoteWorkGuideLayout,
    articleCTA: {
      enabled: true,
      headline: "Need Help Supporting a Remote Workforce?",
      description:
        "Genisys can help secure remote users, improve collaboration and provide reliable access to business systems from anywhere.",
      primaryButton: {
        label: "Book an Expert",
        url: "https://www.genisys.com.au/contact/",
      },
      secondaryButton: {
        label: "Speak to a Consultant",
        url: "https://www.genisys.com.au/contact/",
      },
    },
    relatedArticleSlugs: [
      "vpn-connection-setup-windows-11",
      "microsoft-teams-audio-device-troubleshooting",
      "microsoft-authenticator-setup-guide",
      "what-to-do-if-you-receive-a-phishing-email",
      "backup-and-recovery-best-practices",
    ],
  },
  {
    title: "Downloads & Resources Overview",
    slug: "downloads-resources-overview",
    categorySlug: "downloads-resources",
    summary:
      "Find common policies, user guides and helpful documentation in one place.",
    tags: ["Downloads", "Resources"],
    popularArticle: false,
    estimatedReadTime: 2,
    publishedAt: "2024-04-22T00:00:00.000Z",
    relatedArticleSlugs: [],
  },
  {
    title: "New Starter IT Access Checklist",
    subtitle:
      "Confirm new employee access, devices, security settings and support resources before day one.",
    slug: "new-starter-it-access-checklist",
    categorySlug: "getting-started",
    summary:
      "Confirm new employee access, devices, security settings and support resources before day one.",
    excerpt:
      "Use this checklist to prepare Microsoft 365 accounts, devices, remote access, security controls and first-day verification for new starters.",
    content: newStarterItAccessContent,
    seo: {
      title: "New Starter IT Access Checklist | Genisys Support",
      description:
        "Use this new starter IT checklist to prepare Microsoft 365 access, devices, security settings, remote access and first-day onboarding verification.",
      primaryKeyword: "New Starter IT Access Checklist",
      secondaryKeywords: [
        "employee onboarding checklist",
        "IT onboarding checklist",
        "new starter access",
        "Microsoft 365 onboarding",
        "remote worker setup",
        "new employee IT setup",
      ],
    },
    tags: [
      "Onboarding",
      "Getting Started",
      "Access",
      "Microsoft 365",
      "Devices",
      "MFA",
    ],
    popularArticle: false,
    estimatedReadTime: 7,
    publishedAt: "2024-04-18T00:00:00.000Z",
    guideLayout: newStarterItAccessGuideLayout,
    articleCTA: {
      enabled: true,
      headline: "Need Help Onboarding a New Employee?",
      description:
        "The Genisys Service Desk can help provision accounts, prepare devices and confirm access before a new starter begins.",
      primaryButton: {
        label: "Contact Support",
        url: "https://www.genisys.com.au/contact/",
      },
      secondaryButton: {
        label: "Create a Support Ticket",
        url: "https://my.genisys.com.au/login",
      },
    },
    relatedArticleSlugs: [
      "how-to-set-up-multi-factor-authentication-mfa",
      "microsoft-authenticator-setup-guide",
      "microsoft-365-password-reset-guide",
      "remote-work-best-practice-guide",
      "microsoft-teams-audio-device-troubleshooting",
    ],
  },
];

const pdfResources = [
  {
    title: "Mimecast CI - Outlook Junk Mail Guide",
    slug: "mimecast-ci-outlook-junk-mail-guide",
    description:
      "Learn how to check Outlook junk mail, release legitimate messages and report junk or phishing emails.",
    category: "Email Security",
    resourceType: "PDF Guide",
    fileName: "Mimecast CI.pdf",
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
    fileName: "Mimecraft Security Awareness Training.pdf",
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
    fileName: "Welcome to Threatlocker V.2.3.pdf",
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
    fileName: "DMARC.pdf",
    tags: ["DMARC", "email authentication", "domain protection", "spoofing"],
    featured: false,
    sortOrder: 40,
    status: "published",
    publishedAt: "2024-08-29T00:00:00.000Z",
  },
] as const;

async function upsertResourceFile(resource: (typeof pdfResources)[number]) {
  const filePath = path.join(resourcePdfBasePath, resource.fileName);

  if (!existsSync(filePath)) {
    throw new Error(`Missing PDF resource file: ${filePath}`);
  }

  const existing = await payload.find({
    collection: "resource-files",
    limit: 1,
    where: {
      filename: {
        equals: resource.fileName,
      },
    },
  });

  const data = {
    title: resource.title,
    description: resource.description,
  };

  if (existing.docs[0]) {
    const doc = await payload.update({
      collection: "resource-files",
      id: existing.docs[0].id,
      data,
      filePath,
      overwriteExistingFiles: true,
    });
    resourceFileByName.set(resource.fileName, doc);
    return doc;
  }

  const doc = await payload.create({
    collection: "resource-files",
    data,
    filePath,
  });
  resourceFileByName.set(resource.fileName, doc);
  return doc;
}

async function upsertResource(resource: (typeof pdfResources)[number]) {
  const file = resourceFileByName.get(resource.fileName) || (await upsertResourceFile(resource));
  const data = {
    title: resource.title,
    slug: resource.slug,
    description: resource.description,
    category: resource.category,
    resourceType: resource.resourceType,
    fileUpload: file.id,
    tags: resource.tags.map((tag) => ({ tag })),
    featured: resource.featured,
    sortOrder: resource.sortOrder,
    status: resource.status,
    publishedAt: resource.publishedAt,
  };

  const existing = await payload.find({
    collection: "resources",
    limit: 1,
    where: {
      slug: {
        equals: resource.slug,
      },
    },
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "resources",
      id: existing.docs[0].id,
      data,
    });
    return;
  }

  await payload.create({
    collection: "resources",
    data,
  });
}

async function upsertArticle(article: (typeof articles)[number]) {
  const category = categoryBySlug.get(article.categorySlug);

  if (!category) {
    throw new Error(`Missing category ${article.categorySlug}`);
  }

  const data = {
    title: article.title,
    subtitle: article.subtitle || article.summary,
    slug: article.slug,
    category: category.id,
    summary: article.summary,
    excerpt: article.excerpt || article.summary,
    difficulty: article.difficulty,
    appliesTo: Array.isArray(article.appliesTo)
      ? article.appliesTo.map((item) => ({ item }))
      : [],
    content:
      article.content ||
      lexicalContent([
        article.summary,
        "This guide is managed in Payload CMS and published through the Genisys Support & Knowledge Hub.",
        "Update this article in the Payload admin to add detailed steps, screenshots and related support links.",
      ]),
    tags: article.tags.map((tag) => ({ tag })),
    popularArticle: article.popularArticle,
    estimatedReadTime: article.estimatedReadTime,
    status: "published",
    publishedAt: article.publishedAt,
    guideLayout: article.guideLayout || { enabled: false },
    relatedArticles: [],
    articleCTA: article.articleCTA || { enabled: false },
    seo: normaliseSeo(article.seo),
  };
  const existing = await payload.find({
    collection: "knowledge-articles",
    limit: 1,
    where: {
      slug: {
        equals: article.slug,
      },
    },
  });

  if (existing.docs[0]) {
    const doc = await payload.update({
      collection: "knowledge-articles",
      id: existing.docs[0].id,
      data,
    });
    articleBySlug.set(article.slug, doc);
    return;
  }

  const doc = await payload.create({
    collection: "knowledge-articles",
    data,
  });
  articleBySlug.set(article.slug, doc);
}

for (const category of categories) {
  await upsertCategory(category);
}

for (const article of articles) {
  await upsertArticle(article);
}

for (const article of articles) {
  if (article.relatedArticleSlugs.length === 0) {
    continue;
  }

  const doc = articleBySlug.get(article.slug);
  const relatedArticles = article.relatedArticleSlugs
    .map((slug) => articleBySlug.get(slug)?.id)
    .filter(Boolean);

  if (!doc || relatedArticles.length === 0) {
    continue;
  }

  await payload.update({
    collection: "knowledge-articles",
    id: doc.id,
    data: {
      relatedArticles,
      ...(article.guideLayout
        ? {
            guideLayout: {
              ...article.guideLayout,
              relatedArticles,
            },
          }
        : {}),
    },
  });
}

for (const resource of pdfResources) {
  await upsertResource(resource);
}

await payload.updateGlobal({
  slug: "support-hub-settings",
  data: {
    heroTitle: "How can we help today?",
    heroSubtitle:
      "Search our knowledge base, check system status or get in touch with our support team.",
    searchPlaceholder: "Search articles, topics, support and status...",
    supportCTA: {
      heading: "Need support?",
      body: "Get help from the Genisys team through your preferred support channel.",
      buttonLabel: "Create a Support Ticket",
      buttonURL: "https://my.genisys.com.au/login",
    },
  },
});

console.log("Seeded Payload support hub content.");
process.exit(0);
