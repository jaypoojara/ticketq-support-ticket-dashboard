export type Priority = 'urgent' | 'high' | 'normal' | 'low';
export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';
export type AgentStatus = 'online' | 'away' | 'offline';
export type Channel = 'email' | 'chat' | 'phone';
export type Plan = 'starter' | 'pro' | 'enterprise';

export interface Agent {
  id: string;
  name: string;
  initials: string;
  color: string;
  openTickets: number;
  status: AgentStatus;
}

export interface Message {
  id: string;
  author: string;
  initials: string;
  isAgent: boolean;
  isInternal: boolean;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  number: number;
  subject: string;
  preview: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  slaHoursLeft: number;
  slaTotal: number;
  firstResponseAt: string | null;
  messages: Message[];
  tags: string[];
  satisfaction?: number;
  channel: Channel;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: Plan;
  accountAge: string;
  totalTickets: number;
  lifetimeValue: string;
  notes: string;
  recentTickets: { id: string; subject: string; status: TicketStatus; date: string }[];
}

export const agents: Agent[] = [
  { id: 'a1', name: 'Maya Chen', initials: 'MC', color: '#6366f1', openTickets: 8, status: 'online' },
  { id: 'a2', name: 'James Park', initials: 'JP', color: '#06b6d4', openTickets: 5, status: 'online' },
  { id: 'a3', name: 'Sara Obi', initials: 'SO', color: '#10b981', openTickets: 12, status: 'away' },
  { id: 'a4', name: 'Tom Reed', initials: 'TR', color: '#f59e0b', openTickets: 3, status: 'offline' },
];

export const customers: Record<string, Customer> = {
  c1: {
    id: 'c1', name: 'Alex Rivera', email: 'alex@acmecorp.io', company: 'Acme Corp',
    plan: 'pro', accountAge: '2 years', totalTickets: 14, lifetimeValue: '$2,400/yr',
    notes: 'Key account. Prefers quick resolutions. Slack integration active.',
    recentTickets: [
      { id: 't1', subject: 'Dashboard not loading after update', status: 'open', date: 'Today' },
      { id: 'th2', subject: 'API rate limit questions', status: 'resolved', date: 'Jan 15' },
      { id: 'th3', subject: 'Billing invoice discrepancy', status: 'closed', date: 'Dec 3' },
    ],
  },
  c2: {
    id: 'c2', name: 'Priya Sharma', email: 'priya@stacklabs.dev', company: 'Stack Labs',
    plan: 'enterprise', accountAge: '8 months', totalTickets: 6, lifetimeValue: '$12,000/yr',
    notes: 'Enterprise customer. CTO-level contact. Very technical. Needs fast SLA.',
    recentTickets: [
      { id: 't3', subject: 'Team-based permissions setup', status: 'pending', date: 'Today' },
      { id: 'th4', subject: 'SSO configuration issue', status: 'resolved', date: 'Jan 18' },
    ],
  },
  c3: {
    id: 'c3', name: 'Marcus Webb', email: 'marcus@bloomshop.co', company: 'Bloom Shop',
    plan: 'starter', accountAge: '3 months', totalTickets: 3, lifetimeValue: '$290/yr',
    notes: 'E-commerce store. Uses webhook integrations for order processing.',
    recentTickets: [
      { id: 't4', subject: 'Webhook events not triggering', status: 'new', date: 'Today' },
    ],
  },
  c4: {
    id: 'c4', name: 'Jordan Lee', email: 'jordan@pixelcraft.studio', company: 'Pixel Craft',
    plan: 'pro', accountAge: '1 year', totalTickets: 9, lifetimeValue: '$1,188/yr',
    notes: 'Design agency. Often asks about white-label options. Power user.',
    recentTickets: [
      { id: 't2', subject: 'Cannot export data to CSV', status: 'open', date: 'Today' },
      { id: 'th5', subject: 'Custom domain setup', status: 'closed', date: 'Jan 5' },
    ],
  },
};

export const cannedResponses = [
  {
    id: 'cr1', title: 'Initial Response',
    body: 'Hi {{customer_name}},\n\nThank you for reaching out! I\'ve received your request and I\'m looking into it now. I\'ll get back to you within the hour.\n\nBest,\n{{agent_name}}',
  },
  {
    id: 'cr2', title: 'Need More Info',
    body: 'Hi {{customer_name}},\n\nTo help you better, could you please provide:\n1. Your account ID or email\n2. Steps to reproduce the issue\n3. Any error messages you\'re seeing\n\nThanks,\n{{agent_name}}',
  },
  {
    id: 'cr3', title: 'Issue Resolved',
    body: 'Hi {{customer_name}},\n\nGreat news — the issue has been resolved! Please let us know if you run into anything else.\n\nBest,\n{{agent_name}}',
  },
  {
    id: 'cr4', title: 'Escalation Notice',
    body: 'Hi {{customer_name}},\n\nI\'ve escalated your ticket to our engineering team. This typically takes 24–48 hours. We\'ll keep you updated.\n\nSorry for the wait.\n{{agent_name}}',
  },
  {
    id: 'cr5', title: 'Satisfaction Survey',
    body: 'Hi {{customer_name}},\n\nWe hope your issue was resolved to your satisfaction! Would you mind rating your experience? Your feedback helps us improve.\n\n{{agent_name}}',
  },
];

export const initialTickets: Ticket[] = [
  {
    id: 't1', number: 1042,
    subject: 'Dashboard not loading after latest update',
    preview: 'Since the v2.4.1 update yesterday, the main dashboard just shows a blank screen...',
    customerId: 'c1', customerName: 'Alex Rivera', customerEmail: 'alex@acmecorp.io',
    priority: 'urgent', status: 'open', assignedTo: 'a1',
    createdAt: '2h ago', updatedAt: '15m ago',
    slaHoursLeft: 1.5, slaTotal: 4, firstResponseAt: '1h ago',
    channel: 'email', tags: ['bug', 'dashboard', 'v2.4.1'],
    messages: [
      { id: 'm1', author: 'Alex Rivera', initials: 'AR', isAgent: false, isInternal: false, timestamp: '2h ago', content: "Since the v2.4.1 update yesterday, the main dashboard just shows a blank screen. I've tried clearing cache, different browsers, and incognito mode. Nothing works. This is blocking our entire team." },
      { id: 'm2', author: 'Maya Chen', initials: 'MC', isAgent: true, isInternal: false, timestamp: '1h ago', content: "Hi Alex, I'm so sorry to hear this is blocking your team! I've reproduced the issue on our end — it appears related to a cache invalidation bug introduced in v2.4.1. Our engineering team is actively working on a fix." },
      { id: 'm3', author: 'Maya Chen', initials: 'MC', isAgent: true, isInternal: true, timestamp: '45m ago', content: "Engineering confirmed: Redis cache invalidation bug. Hot fix deploying in ~30 mins. Do NOT close this ticket until deployment is verified." },
    ],
  },
  {
    id: 't2', number: 1041,
    subject: 'Cannot export data to CSV — getting 500 error',
    preview: 'Every time I click Export → CSV, I get a server error. Started about 4 hours ago...',
    customerId: 'c4', customerName: 'Jordan Lee', customerEmail: 'jordan@pixelcraft.studio',
    priority: 'high', status: 'open', assignedTo: 'a2',
    createdAt: '4h ago', updatedAt: '1h ago',
    slaHoursLeft: 3, slaTotal: 8, firstResponseAt: '3h ago',
    channel: 'chat', tags: ['export', 'bug', 'csv'],
    messages: [
      { id: 'm4', author: 'Jordan Lee', initials: 'JL', isAgent: false, isInternal: false, timestamp: '4h ago', content: "Every time I click Export → CSV on the Analytics page, I get a '500 Internal Server Error'. This started 4 hours ago. We need this for a client report due today." },
      { id: 'm5', author: 'James Park', initials: 'JP', isAgent: true, isInternal: false, timestamp: '3h ago', content: "Hi Jordan, I can see the error in our logs. Your export contains 50,000+ rows which hit a temporary limit. I'm adjusting the limit now — should be resolved in a few minutes." },
    ],
  },
  {
    id: 't3', number: 1040,
    subject: 'How to set up team-based permissions?',
    preview: 'We\'re onboarding 5 new team members and want to restrict access by department...',
    customerId: 'c2', customerName: 'Priya Sharma', customerEmail: 'priya@stacklabs.dev',
    priority: 'normal', status: 'pending', assignedTo: 'a1',
    createdAt: '1d ago', updatedAt: '3h ago',
    slaHoursLeft: 12, slaTotal: 24, firstResponseAt: '20h ago',
    channel: 'email', tags: ['permissions', 'onboarding', 'team'],
    messages: [
      { id: 'm6', author: 'Priya Sharma', initials: 'PS', isAgent: false, isInternal: false, timestamp: '1d ago', content: "We're onboarding 5 new team members and want to restrict access by department (Sales, Engineering, Finance). What's the best way to set this up?" },
      { id: 'm7', author: 'Maya Chen', initials: 'MC', isAgent: true, isInternal: false, timestamp: '20h ago', content: "Hi Priya! You can set this up under Settings → Permissions → Team Roles. I've put together a step-by-step guide for your specific setup. Let me know if anything's unclear!" },
      { id: 'm8', author: 'Priya Sharma', initials: 'PS', isAgent: false, isInternal: false, timestamp: '3h ago', content: "Thanks! I followed the guide but step 3 looks different in our UI — we're on Enterprise plan. Could you double-check?" },
    ],
  },
  {
    id: 't4', number: 1039,
    subject: 'Webhook events not triggering for order.completed',
    preview: 'Our order.completed webhook hasn\'t fired since last Tuesday. order.created still works...',
    customerId: 'c3', customerName: 'Marcus Webb', customerEmail: 'marcus@bloomshop.co',
    priority: 'high', status: 'new', assignedTo: null,
    createdAt: '30m ago', updatedAt: '30m ago',
    slaHoursLeft: 3.5, slaTotal: 4, firstResponseAt: null,
    channel: 'email', tags: ['webhooks', 'integration'],
    messages: [
      { id: 'm9', author: 'Marcus Webb', initials: 'MW', isAgent: false, isInternal: false, timestamp: '30m ago', content: "Our order.completed webhook hasn't fired since last Tuesday. order.created and order.updated still work fine. Our endpoint is receiving other events. Something seems wrong on your end." },
    ],
  },
  {
    id: 't5', number: 1038,
    subject: 'Request: Dark mode for the mobile app',
    preview: 'Our team uses the mobile app frequently and we\'d love a dark mode option for late-night shifts...',
    customerId: 'c1', customerName: 'Alex Rivera', customerEmail: 'alex@acmecorp.io',
    priority: 'low', status: 'open', assignedTo: 'a3',
    createdAt: '3d ago', updatedAt: '2d ago',
    slaHoursLeft: 48, slaTotal: 72, firstResponseAt: '3d ago',
    channel: 'email', tags: ['feature-request', 'mobile', 'ui'],
    messages: [
      { id: 'm10', author: 'Alex Rivera', initials: 'AR', isAgent: false, isInternal: false, timestamp: '3d ago', content: "Our team uses the mobile app frequently and we'd love a dark mode option. It's especially useful for late-night on-call shifts." },
      { id: 'm11', author: 'Sara Obi', initials: 'SO', isAgent: true, isInternal: false, timestamp: '2d ago', content: "Hi Alex! Dark mode is on our roadmap for Q2. I've added your account as a +1 to the feature request. We'll notify you when it ships!" },
    ],
  },
  {
    id: 't6', number: 1037,
    subject: 'Account locked after failed 2FA attempts',
    preview: 'My colleague tried logging in and after 3 failed 2FA attempts, the account got locked...',
    customerId: 'c4', customerName: 'Jordan Lee', customerEmail: 'jordan@pixelcraft.studio',
    priority: 'urgent', status: 'resolved', assignedTo: 'a2',
    createdAt: '1d ago', updatedAt: '22h ago',
    slaHoursLeft: 0, slaTotal: 4, firstResponseAt: '1d ago',
    channel: 'phone', tags: ['account', '2fa', 'security'],
    satisfaction: 5,
    messages: [
      { id: 'm12', author: 'Jordan Lee', initials: 'JL', isAgent: false, isInternal: false, timestamp: '1d ago', content: "My colleague's account got locked after 3 failed 2FA attempts. We need it unlocked urgently — they're presenting to a client in 2 hours." },
      { id: 'm13', author: 'James Park', initials: 'JP', isAgent: true, isInternal: false, timestamp: '23h ago', content: "On it! I've unlocked the account and reset the 2FA. Please have your colleague check their email for the re-enrollment link. Should be good to go!" },
    ],
  },
  {
    id: 't7', number: 1036,
    subject: 'Billing shows wrong plan tier on invoice',
    preview: 'Invoice #INV-2024-892 shows us on Starter plan but we\'re on Pro...',
    customerId: 'c2', customerName: 'Priya Sharma', customerEmail: 'priya@stacklabs.dev',
    priority: 'normal', status: 'closed', assignedTo: 'a4',
    createdAt: '5d ago', updatedAt: '4d ago',
    slaHoursLeft: 0, slaTotal: 24, firstResponseAt: '5d ago',
    channel: 'email', tags: ['billing', 'invoice'],
    satisfaction: 4,
    messages: [
      { id: 'm14', author: 'Priya Sharma', initials: 'PS', isAgent: false, isInternal: false, timestamp: '5d ago', content: "Invoice #INV-2024-892 shows us on the Starter plan but we upgraded to Pro 6 weeks ago. We need a corrected invoice for accounting." },
      { id: 'm15', author: 'Tom Reed', initials: 'TR', isAgent: true, isInternal: false, timestamp: '4d ago', content: "I've corrected the invoice and sent it to your billing email. I also applied a 10% credit to your next billing cycle for the inconvenience. Sorry about that!" },
    ],
  },
];
