"use client";

import { useState, useMemo } from "react";
import { initialTickets, customers, agents, Ticket, Priority, TicketStatus } from "@/lib/ticketData";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TicketList } from "@/components/dashboard/TicketList";
import { TicketDetail } from "@/components/dashboard/TicketDetail";
import { CustomerPanel } from "@/components/dashboard/CustomerPanel";

type NavView = 'inbox' | 'all' | 'mine' | 'team' | 'reports';

export default function Dashboard() {
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

  // When clicking a past ticket from customer panel that doesn't exist in list, just do nothing
  const handleCustomerTicketSelect = (id: string) => {
    const found = tickets.find((t) => t.id === id);
    if (found) setSelectedId(id);
  };

  const counts = {
    urgent: tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length,
    unassigned: tickets.filter((t) => !t.assignedTo && t.status !== 'resolved' && t.status !== 'closed').length,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Left sidebar */}
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        currentAgentId={agentFilter}
        onAgentChange={setAgentFilter}
      />

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

          {/* Customer panel */}
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

      {/* Stats bar — floats over the header area */}
      <div
        className="fixed top-0 right-0 flex items-center gap-3 px-4 py-2 z-30"
        style={{ pointerEvents: 'none' }}
      >
        {counts.urgent > 0 && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', pointerEvents: 'auto' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {counts.urgent} urgent
          </div>
        )}
        {counts.unassigned > 0 && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa', pointerEvents: 'auto' }}
          >
            {counts.unassigned} unassigned
          </div>
        )}
      </div>
    </div>
  );
}
