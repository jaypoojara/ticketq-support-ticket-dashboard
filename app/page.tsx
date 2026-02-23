"use client";

import { useState, useMemo } from "react";
import { useMember, useMemberstack } from "@memberstack/react";
import { initialTickets, customers, agents, Ticket, Priority, TicketStatus } from "@/lib/ticketData";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TicketList } from "@/components/dashboard/TicketList";
import { TicketDetail } from "@/components/dashboard/TicketDetail";
import { CustomerPanel } from "@/components/dashboard/CustomerPanel";

type NavView = 'inbox' | 'all' | 'mine' | 'team' | 'reports';

const viewLabels: Record<NavView, string> = {
  inbox: 'Inbox',
  all: 'All Tickets',
  mine: 'My Tickets',
  team: 'Team View',
  reports: 'Reports',
};

export default function Dashboard() {
  const { data: member } = useMember();
  const memberstack = useMemberstack();

  // Derive a display name from the Memberstack member
  const memberName =
    (member as { customFields?: { name?: string } } | null)?.customFields?.name ||
    member?.auth?.email?.split("@")[0] ||
    "Agent";
  const memberInitials = memberName
    .split(" ")
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "AG";

  const handleLogout = async () => {
    try {
      await memberstack.logoutMember();
    } catch {
      // ignore errors — proceed to redirect regardless
    }
    window.location.href = "/api/logout";
  };

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedId, setSelectedId] = useState<string>('t1');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<NavView>('inbox');
  const [agentFilter, setAgentFilter] = useState('');
  const [showCustomerPanel, setShowCustomerPanel] = useState(true);

  const selectedTicket = tickets.find((t) => t.id === selectedId) ?? tickets[0];
  const selectedCustomer = customers[selectedTicket?.customerId ?? ''];

  const viewFilteredTickets = useMemo(() => {
    let list = tickets;
    if (activeView === 'mine') {
      list = list.filter((t) => t.assignedTo === 'a1');
    } else if (activeView === 'inbox') {
      list = list.filter((t) => t.status !== 'closed');
    }
    if (agentFilter) {
      list = list.filter((t) => t.assignedTo === agentFilter);
    }
    return list;
  }, [tickets, activeView, agentFilter]);

  const handleStatusChange = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => t.id === id ? { ...t, status, updatedAt: 'just now' } : t)
    );
  };

  const handlePriorityChange = (id: string, priority: Priority) => {
    setTickets((prev) =>
      prev.map((t) => t.id === id ? { ...t, priority } : t)
    );
  };

  const handleAssign = (id: string, agentId: string) => {
    setTickets((prev) =>
      prev.map((t) => t.id === id ? { ...t, assignedTo: agentId || null } : t)
    );
  };

  const handleAddMessage = (ticketId: string, content: string, isInternal: boolean) => {
    const newMsg = {
      id: `m-${Date.now()}`,
      author: 'Maya Chen',
      initials: 'MC',
      isAgent: true,
      isInternal,
      content,
      timestamp: 'just now',
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              updatedAt: 'just now',
              firstResponseAt: t.firstResponseAt ?? 'just now',
            }
          : t
      )
    );
  };

  const handleCustomerTicketSelect = (id: string) => {
    const found = tickets.find((t) => t.id === id);
    if (found) setSelectedId(id);
  };

  const urgentCount = tickets.filter(
    (t) => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  const unassignedCount = tickets.filter(
    (t) => !t.assignedTo && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Left sidebar */}
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        currentAgentId={agentFilter}
        onAgentChange={setAgentFilter}
        urgentCount={urgentCount}
      />

      {/* Right side — column: top bar + content row */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-5 flex-shrink-0"
          style={{
            height: 52,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>
            {viewLabels[activeView]}
          </div>
          {agentFilter && (
            <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: agents.find((a) => a.id === agentFilter)?.color, fontSize: 8 }}
              >
                {agents.find((a) => a.id === agentFilter)?.initials}
              </div>
              {agents.find((a) => a.id === agentFilter)?.name}
              <button onClick={() => setAgentFilter('')} className="ml-0.5 opacity-60 hover:opacity-100">×</button>
            </div>
          )}

          {/* Alert pills */}
          <div className="flex items-center gap-2 ml-auto">
            {urgentCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}
                onClick={() => { setPriorityFilter('urgent'); setStatusFilter('all'); }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
                {urgentCount} urgent
              </div>
            )}
            {unassignedCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa' }}
              >
                {unassignedCount} unassigned
              </div>
            )}

            {/* Current member identity + logout */}
            <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                {memberInitials}
              </div>
              <span
                className="text-sm font-medium max-w-[120px] truncate"
                style={{ color: 'var(--fg)' }}
              >
                {memberName}
              </span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10b981' }} />

              {/* Sign out */}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="ml-1 flex items-center justify-center rounded-md p-1.5 transition-colors"
                style={{ color: 'var(--fg-muted)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-panel)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content row */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Ticket list */}
          <TicketList
            tickets={viewFilteredTickets}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
          />

          {/* Main content */}
          {selectedTicket ? (
            <>
              <TicketDetail
                ticket={selectedTicket}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onAssign={handleAssign}
                onAddMessage={handleAddMessage}
                showCustomerPanel={showCustomerPanel}
                onToggleCustomer={() => setShowCustomerPanel((v) => !v)}
              />

              {showCustomerPanel && selectedCustomer && (
                <CustomerPanel
                  customer={selectedCustomer}
                  onClose={() => setShowCustomerPanel(false)}
                  onTicketSelect={handleCustomerTicketSelect}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center" style={{ color: 'var(--fg-muted)' }}>
              <div className="text-center">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 48, height: 48, opacity: 0.2, margin: '0 auto 12px' }}>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <p className="text-sm">Select a ticket to view it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
