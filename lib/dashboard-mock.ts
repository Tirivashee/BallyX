/**
 * Illustrative mock data for the hosting dashboard preview. This is a
 * front-end-only UI shell — nothing here is backed by real infrastructure,
 * and the domains/sites below are fictitious placeholders, never real
 * client data.
 */
export const mockUser = {
  name: "Demo Client",
  email: "demo.client@example.com",
  plan: "Standard",
} as const;

export const mockStats = [
  { label: "Sites hosted", value: "5" },
  { label: "Uptime (30d)", value: "99.98%" },
  { label: "SSL certificates", value: "5 active" },
  { label: "Storage used", value: "9.6 GB / 40 GB" },
] as const;

export type MockSite = {
  id: string;
  name: string;
  domain: string;
  status: "Live" | "Building" | "Paused";
  plan: string;
  lastDeploy: string;
};

export const mockSites: MockSite[] = [
  {
    id: "site-1",
    name: "Example Storefront",
    domain: "shop.example.com",
    status: "Live",
    plan: "Standard",
    lastDeploy: "2 hours ago",
  },
  {
    id: "site-2",
    name: "Client Portal Demo",
    domain: "portal.example.com",
    status: "Live",
    plan: "Pro",
    lastDeploy: "1 day ago",
  },
  {
    id: "site-3",
    name: "Marketing Preview",
    domain: "preview.example.com",
    status: "Building",
    plan: "Standard",
    lastDeploy: "Just now",
  },
  {
    id: "site-4",
    name: "Internal Ops Tool",
    domain: "ops.example.com",
    status: "Live",
    plan: "Pro",
    lastDeploy: "3 days ago",
  },
  {
    id: "site-5",
    name: "Staging — Client Portal",
    domain: "staging.portal.example.com",
    status: "Paused",
    plan: "Standard",
    lastDeploy: "2 weeks ago",
  },
];

export type MockDomain = {
  domain: string;
  status: "Active" | "Pending" | "Expired";
  registrar: string;
  registeredOn: string;
  expiresOn: string;
  autoRenew: boolean;
  privacyProtection: boolean;
  locked: boolean;
  nameservers: string[];
  ssl: string;
};

export const mockDomains: MockDomain[] = [
  {
    domain: "example.com",
    status: "Active",
    registrar: "BallyX Hosting",
    registeredOn: "12 Mar 2023",
    expiresOn: "12 Mar 2027",
    autoRenew: true,
    privacyProtection: true,
    locked: true,
    nameservers: ["ns1.ballyxhosting.com", "ns2.ballyxhosting.com"],
    ssl: "Valid — auto-renews",
  },
  {
    domain: "shop.example.com",
    status: "Active",
    registrar: "BallyX Hosting",
    registeredOn: "2 Jun 2024",
    expiresOn: "2 Jun 2026",
    autoRenew: true,
    privacyProtection: false,
    locked: true,
    nameservers: ["ns1.ballyxhosting.com", "ns2.ballyxhosting.com"],
    ssl: "Valid — auto-renews",
  },
  {
    domain: "portal.example.com",
    status: "Pending",
    registrar: "BallyX Hosting",
    registeredOn: "18 Jul 2026",
    expiresOn: "18 Jul 2027",
    autoRenew: false,
    privacyProtection: true,
    locked: false,
    nameservers: ["ns1.ballyxhosting.com", "ns2.ballyxhosting.com"],
    ssl: "Awaiting DNS verification",
  },
  {
    domain: "ops.example.com",
    status: "Active",
    registrar: "BallyX Hosting",
    registeredOn: "9 Sep 2025",
    expiresOn: "9 Sep 2026",
    autoRenew: true,
    privacyProtection: true,
    locked: true,
    nameservers: ["ns1.ballyxhosting.com", "ns2.ballyxhosting.com"],
    ssl: "Valid — auto-renews",
  },
];

export type MockDnsRecord = {
  id: string;
  type: "A" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: string;
};

export const mockDnsRecords: Record<string, MockDnsRecord[]> = {
  "example.com": [
    { id: "r1", type: "A", name: "@", value: "76.76.21.21", ttl: "3600" },
    { id: "r2", type: "CNAME", name: "www", value: "example.com", ttl: "3600" },
    { id: "r3", type: "MX", name: "@", value: "10 mail.example.com", ttl: "3600" },
    {
      id: "r4",
      type: "TXT",
      name: "@",
      value: '"v=spf1 include:_spf.example.com ~all"',
      ttl: "3600",
    },
  ],
  "shop.example.com": [
    { id: "r1", type: "A", name: "@", value: "76.76.21.21", ttl: "3600" },
    {
      id: "r2",
      type: "CNAME",
      name: "www",
      value: "shop.example.com",
      ttl: "3600",
    },
  ],
  "portal.example.com": [
    {
      id: "r1",
      type: "CNAME",
      name: "@",
      value: "cname.ballyxhosting.com",
      ttl: "3600",
    },
  ],
  "ops.example.com": [
    { id: "r1", type: "A", name: "@", value: "76.76.21.22", ttl: "3600" },
    {
      id: "r2",
      type: "TXT",
      name: "@",
      value: '"v=spf1 include:_spf.example.com ~all"',
      ttl: "3600",
    },
  ],
};

export type MockInvoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Due" | "Overdue";
};

export const mockInvoices: MockInvoice[] = [
  {
    id: "INV-2026-0007",
    date: "1 Jul 2026",
    description: "Standard hosting — July 2026",
    amount: "{{INVOICE_AMOUNT}}",
    status: "Paid",
  },
  {
    id: "INV-2026-0006",
    date: "1 Jun 2026",
    description: "Standard hosting — June 2026",
    amount: "{{INVOICE_AMOUNT}}",
    status: "Paid",
  },
  {
    id: "INV-2026-0005",
    date: "1 May 2026",
    description: "Standard hosting — May 2026",
    amount: "{{INVOICE_AMOUNT}}",
    status: "Paid",
  },
  {
    id: "INV-2026-0008",
    date: "1 Aug 2026",
    description: "Standard hosting — August 2026",
    amount: "{{INVOICE_AMOUNT}}",
    status: "Due",
  },
];

export type MockBackup = {
  id: string;
  site: string;
  createdAt: string;
  size: string;
  type: "Automatic" | "Manual";
};

export const mockBackups: MockBackup[] = [
  {
    id: "bk-1",
    site: "Example Storefront",
    createdAt: "Today, 03:00",
    size: "412 MB",
    type: "Automatic",
  },
  {
    id: "bk-2",
    site: "Client Portal Demo",
    createdAt: "Today, 03:00",
    size: "268 MB",
    type: "Automatic",
  },
  {
    id: "bk-3",
    site: "Example Storefront",
    createdAt: "Yesterday, 03:00",
    size: "410 MB",
    type: "Automatic",
  },
  {
    id: "bk-4",
    site: "Internal Ops Tool",
    createdAt: "3 days ago, 14:12",
    size: "1.1 GB",
    type: "Manual",
  },
];

export type MockActivityEntry = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
};

export const mockActivity: MockActivityEntry[] = [
  {
    id: "act-1",
    timestamp: "Today, 09:14",
    actor: "You",
    action: "Signed in",
    detail: "Dashboard preview session started.",
  },
  {
    id: "act-2",
    timestamp: "Today, 03:00",
    actor: "System",
    action: "Automatic backup completed",
    detail: "Example Storefront — 412 MB.",
  },
  {
    id: "act-3",
    timestamp: "Yesterday, 16:42",
    actor: "BallyX team",
    action: "Deployed update",
    detail: "Marketing Preview — new build published.",
  },
  {
    id: "act-4",
    timestamp: "3 days ago",
    actor: "BallyX team",
    action: "Created manual backup",
    detail: "Internal Ops Tool — before a schema change.",
  },
  {
    id: "act-5",
    timestamp: "5 days ago",
    actor: "You",
    action: "Updated DNS record",
    detail: "Added a TXT record on ops.example.com.",
  },
];

export type MockTicket = {
  id: string;
  subject: string;
  status: "Open" | "Closed";
  createdAt: string;
  lastUpdate: string;
  messages: { from: "You" | "BallyX Support"; body: string; at: string }[];
};

export const mockTickets: MockTicket[] = [
  {
    id: "TCK-0014",
    subject: "SSL certificate renewal question",
    status: "Open",
    createdAt: "2 days ago",
    lastUpdate: "1 day ago",
    messages: [
      {
        from: "You",
        body: "Does the SSL cert on shop.example.com renew automatically?",
        at: "2 days ago",
      },
      {
        from: "BallyX Support",
        body: "Yes — it auto-renews about 30 days before expiry, no action needed.",
        at: "1 day ago",
      },
    ],
  },
  {
    id: "TCK-0009",
    subject: "Requesting a manual backup before a migration",
    status: "Closed",
    createdAt: "3 weeks ago",
    lastUpdate: "3 weeks ago",
    messages: [
      {
        from: "You",
        body: "Could you take a manual backup of Internal Ops Tool before we migrate data?",
        at: "3 weeks ago",
      },
      {
        from: "BallyX Support",
        body: "Done — backup created and listed under Backups.",
        at: "3 weeks ago",
      },
    ],
  },
];
