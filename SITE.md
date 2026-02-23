# TicketQ — Support Ticket Dashboard

> A mini-Zendesk you can customize. Built for small SaaS teams who want powerful support without enterprise complexity.

## Brand Identity
- **Personality:** Professional, efficient, trustworthy — like a calm support agent who always has the answer
- **Colors:** Indigo-tinted background (#eef2ff), deep indigo sidebar (#1e1b4b), indigo accent (#6366f1). No black or white backgrounds.
- **Fonts:** Outfit (headings/display) + Plus Jakarta Sans (body text)
- **Feel:** Dense information displayed cleanly — like Notion or Linear

## Pages
- **Dashboard** (`/`) — The full support ticket dashboard with all panels
- **Login** (`/login`) — Branded sign-in page. Required before accessing the dashboard. Shows "Need access? Contact your admin." instead of a signup link.

## Authentication (Memberstack)
TicketQ uses **Memberstack** to protect the dashboard. Only logged-in members can access it.

### How it works
1. Any visitor who isn't logged in is automatically sent to `/login`
2. They sign in with email + password (agents are added by the admin in Memberstack)
3. After success, they land on the dashboard
4. Their name/email appears in the top bar, with a sign-out button

### Setup required
You must add your Memberstack public key to the `.env.local` file:
```
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_your_actual_key_here
```
Get this key from your Memberstack dashboard under **Settings → API Keys**.

### Key files
- `middleware.ts` — Handles redirect logic (unauthenticated → `/login`, logged-in → `/`)
- `components/MemberstackWrapper.tsx` — Wraps the app with the Memberstack provider
- `app/login/page.tsx` — The custom login page

## Components

### AppSidebar (`components/dashboard/AppSidebar.tsx`)
Left navigation panel with:
- TicketQ logo + branding
- Nav items: Inbox, All Tickets, My Tickets, Team View, Reports
- Agent team list with online/away/offline status indicators
- Click an agent to filter tickets by that agent

### TicketList (`components/dashboard/TicketList.tsx`)
Middle ticket queue panel with:
- Search bar (searches subject, customer name, email, tags, ticket number)
- Priority filter dropdown
- Status tabs (All, New, Open, Pending, Resolved, Closed) with counts
- Ticket rows showing: priority badge, status badge, subject, customer name, SLA progress bar, assigned agent avatar, channel icon, time

### TicketDetail (`components/dashboard/TicketDetail.tsx`)
Main ticket conversation view with:
- Ticket header: number, subject, channel, created time
- Dropdowns to change status, priority, and assigned agent
- Tags display
- SLA progress bar with time remaining (turns red when critical)
- Satisfaction stars for resolved/closed tickets
- Full message thread (customer messages left, agent replies right, internal notes yellow)
- Reply box with toggle between "Reply" and "Internal Note" modes
- Canned response library (5 responses with variable substitution)
- "Reply & Set [Next Status]" quick action button
- Customer panel toggle button

### CustomerPanel (`components/dashboard/CustomerPanel.tsx`)
Right sidebar with customer info:
- Avatar, name, company, plan badge (Starter/Pro/Enterprise), lifetime value, email
- Stats: account age, total tickets
- Editable agent notes (click Edit to modify, click Save to save)
- Previous tickets list (clickable to navigate to those tickets)

## Data (`lib/ticketData.ts`)
Mock data including:
- 4 agents (Maya Chen, James Park, Sara Obi, Tom Reed) with workload counts
- 4 customers across Starter/Pro/Enterprise plans
- 7 tickets across all statuses and priorities
- 5 canned responses with variable placeholders

## Key Features (all interactive)
- **Ticket queue** — filterable by status, priority, search
- **Priority levels** — Urgent (red), High (orange), Normal (blue), Low (gray)
- **SLA tracking** — visual progress bar, turns red when < 2 hours remain
- **Status workflow** — New → Open → Pending → Resolved → Closed (all changeable via dropdown)
- **Agent assignment** — dropdown shows agent workload counts
- **Canned responses** — click to insert, auto-fills customer/agent name variables
- **Internal notes** — yellow-tinted, locked icon, not visible to customers
- **Customer sidebar** — account info, notes, ticket history, all interactive
- **Satisfaction ratings** — shown as stars on resolved/closed tickets

## Recent Changes
- 2026-02-23: Removed self-signup — agents are now added via Memberstack dashboard (invite-only)
- 2026-02-23: Added Memberstack auth — login page, route protection middleware, real member identity in top bar, sign-out button
- 2026-02-23: Created full TicketQ dashboard template with all interactive features

## How to Customize
- **To connect real auth:** Replace `pk_your_key_here` in `.env.local` with your actual Memberstack public key
- **To change colors:** Edit the CSS variables at the top of `app/globals.css`
- **To add tickets:** Add entries to the `initialTickets` array in `lib/ticketData.ts`
- **To add agents:** Add entries to the `agents` array in `lib/ticketData.ts`
- **To add canned responses:** Add entries to the `cannedResponses` array in `lib/ticketData.ts`
- **To add customers:** Add entries to the `customers` object in `lib/ticketData.ts`

## Comparable Products
Zendesk, Intercom, Help Scout
