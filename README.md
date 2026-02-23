# TicketQ — Support Ticket Dashboard

A customizable support ticket dashboard for small SaaS teams. Built with Next.js and Memberstack — deploy it, add your agents, and start handling support.

---

## What's Included

- Full ticket dashboard (inbox, queue, ticket detail, customer panel)
- Login page protected by Memberstack
- Agent assignment, SLA tracking, canned responses, internal notes
- Priority levels, status workflow, satisfaction ratings

---

## Getting Started

### 1. Set Up Memberstack

TicketQ uses [Memberstack](https://memberstack.com) to handle agent authentication. You'll need a free account.

1. Go to [app.memberstack.com](https://app.memberstack.com) and create an account
2. Create a new app inside Memberstack
3. Go to **Settings → API Keys**
4. Copy your **Public Key** (starts with `pk_`)

### 2. Add Your Memberstack Key

Create a file called `.env.local` in the root of this project and add:

```
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_your_actual_key_here
```

Replace `pk_your_actual_key_here` with the key you copied.

### 3. Add Your First Agent

There is no public signup page — agents are added by you directly in Memberstack.

1. In the Memberstack dashboard, go to **Members**
2. Click **Add Member**
3. Enter the agent's **email** and a **password**
4. Click **Save**

That agent can now log in at `/login` on your dashboard.

### 4. Start the Dev Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## How Authentication Works

| Situation | What Happens |
|-----------|-------------|
| Visitor not logged in | Automatically redirected to `/login` |
| Agent enters correct credentials | Redirected to the dashboard |
| Agent enters wrong credentials | Error shown on login page |
| Logged-in agent visits `/login` | Redirected to dashboard |
| Agent clicks "Sign Out" | Session cleared, redirected to `/login` |

There is no self-signup. Only agents you add manually in Memberstack can access the dashboard.

---

## Managing Agents

All agent management happens in your **Memberstack dashboard** at [app.memberstack.com](https://app.memberstack.com).

### Add an agent
1. Go to **Members → Add Member**
2. Enter their email and password
3. They can log in immediately

### Remove an agent
1. Go to **Members**, find the agent
2. Click on their name → **Delete Member**
3. They will no longer be able to log in

### Reset an agent's password
1. Go to **Members**, find the agent
2. Click **Edit** and update their password
3. Share the new password with them

---

## Customizing the Dashboard

| What to change | Where |
|----------------|-------|
| Ticket data & agents | `lib/ticketData.ts` |
| Colors | CSS variables at the top of `app/globals.css` |
| Canned responses | `cannedResponses` array in `lib/ticketData.ts` |
| Customer records | `customers` object in `lib/ticketData.ts` |

---

## Project Structure

```
app/
├── layout.tsx           # App wrapper (fonts, Memberstack provider)
├── page.tsx             # Dashboard (protected)
├── login/page.tsx       # Login page
├── globals.css          # Global styles + CSS variables
components/
├── dashboard/           # All dashboard panels
│   ├── AppSidebar.tsx   # Left navigation
│   ├── TicketList.tsx   # Middle ticket queue
│   ├── TicketDetail.tsx # Main conversation view
│   └── CustomerPanel.tsx# Right customer info panel
├── MemberstackWrapper.tsx # Auth provider
lib/
└── ticketData.ts        # All mock data (tickets, agents, customers)
middleware.ts            # Route protection logic
```

---

## Deploy

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

When deploying, add `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` as an environment variable in your Vercel project settings.

---

## Tech Stack

- [Next.js 14+](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Memberstack](https://memberstack.com) — Authentication
