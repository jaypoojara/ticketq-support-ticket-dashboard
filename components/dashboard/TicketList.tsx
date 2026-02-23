"use client";

import { Ticket, Priority, TicketStatus, agents } from "@/lib/ticketData";

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
}

const statusTabs: { id: string; label: string }[] = [
  { id: 'all',      label: 'All'     },
  { id: 'new',      label: 'New'     },
  { id: 'open',     label: 'Open'    },
  { id: 'pending',  label: 'Pending' },
  { id: 'resolved', label: 'Resolved'},
  { id: 'closed',   label: 'Closed'  },
];

const priorityConfig: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: 'Urgent', color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
  high:   { label: 'High',   color: '#f97316', bg: '#fff7ed', dot: '#f97316' },
  normal: { label: 'Normal', color: '#3b82f6', bg: '#eff6ff', dot: '#3b82f6' },
  low:    { label: 'Low',    color: '#9ca3af', bg: '#f9fafb', dot: '#9ca3af' },
};

const statusConfig: Record<TicketStatus, { color: string }> = {
  new:      { color: '#8b5cf6' },
  open:     { color: '#3b82f6' },
  pending:  { color: '#f59e0b' },
  resolved: { color: '#10b981' },
  closed:   { color: '#9ca3af' },
};

const channelIcons: Record<string, string> = {
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
  chat:  'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
};

export function TicketList({
  tickets, selectedId, onSelect,
  searchQuery, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
}: TicketListProps) {
  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        String(t.number).includes(q)
      );
    }
    return true;
  });

  const counts: Record<string, number> = { all: tickets.length };
  tickets.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });

  return (
    <div
      className="flex h-full flex-col"
      style={{ width: 320, background: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}
    >
      {/* Search + filter header */}
      <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Search */}
        <div className="relative mb-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ width: 13, height: 13, color: 'var(--fg-muted)' }}
          >
            <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg pl-8 pr-3 outline-none transition-all"
            style={{
              height: 34,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--fg)',
              fontSize: 12,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--fg-muted)' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Priority + count row */}
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="flex-1 rounded-lg px-2.5 outline-none cursor-pointer"
            style={{
              height: 30,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: priorityFilter !== 'all' ? 'var(--fg)' : 'var(--fg-muted)',
              fontSize: 11,
            }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="normal">🔵 Normal</option>
            <option value="low">⚪ Low</option>
          </select>
          <div
            className="flex items-center justify-center rounded-lg font-semibold text-xs"
            style={{
              height: 30,
              minWidth: 30,
              background: 'var(--accent)',
              color: 'white',
              padding: '0 8px',
            }}
          >
            {filtered.length}
          </div>
        </div>
      </div>

      {/* Status tabs — 3-column grid so all 6 always fit */}
      <div
        className="grid gap-1 px-3 py-2"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-panel)',
        }}
      >
        {statusTabs.map((tab) => {
          const active = statusFilter === tab.id;
          const count = counts[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className="flex items-center justify-center gap-1 py-1 rounded-md text-xs font-medium transition-all"
              style={{
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? 'white' : 'var(--fg-muted)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {tab.label}
              {count ? (
                <span
                  className="font-semibold"
                  style={{ opacity: active ? 0.85 : 0.7, fontSize: 10 }}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Ticket list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: 'var(--fg-muted)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32, opacity: 0.3 }}>
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <p className="text-sm">No tickets found</p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const selected = selectedId === ticket.id;
            const pc = priorityConfig[ticket.priority];
            const sc = statusConfig[ticket.status];
            const assignedAgent = ticket.assignedTo ? agents.find((a) => a.id === ticket.assignedTo) : null;
            const slaPercent = Math.min(100, ((ticket.slaTotal - ticket.slaHoursLeft) / ticket.slaTotal) * 100);
            const slaCritical = ticket.slaHoursLeft < 2 && ticket.status !== 'resolved' && ticket.status !== 'closed';

            return (
              <button
                key={ticket.id}
                onClick={() => onSelect(ticket.id)}
                className="w-full text-left px-4 py-3 transition-all relative"
                style={{
                  background: selected ? 'var(--accent-light)' : 'transparent',
                  borderBottom: '1px solid var(--border-light)',
                  borderLeft: `3px solid ${selected ? 'var(--accent)' : pc.dot}`,
                }}
                onMouseEnter={(e) => {
                  if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Row 1: number + priority + channel */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono" style={{ color: 'var(--fg-muted)' }}>#{ticket.number}</span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: pc.bg, color: pc.color }}
                  >
                    {pc.label}
                  </span>
                  <span
                    className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: `${sc.color}15`, color: sc.color }}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Row 2: subject */}
                <div
                  className="text-sm font-semibold mb-1 line-clamp-1"
                  style={{ color: 'var(--fg)', fontFamily: 'var(--font-outfit)' }}
                >
                  {ticket.subject}
                </div>

                {/* Row 3: customer + preview */}
                <div className="text-xs mb-2 line-clamp-1" style={{ color: 'var(--fg-muted)' }}>
                  <span className="font-medium">{ticket.customerName}</span> · {ticket.preview}
                </div>

                {/* Row 4: SLA + agent + time */}
                <div className="flex items-center gap-2">
                  {/* SLA bar */}
                  {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                    <div className="flex-1 flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${slaPercent}%`,
                            background: slaCritical ? '#ef4444' : slaPercent > 75 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: slaCritical ? '#ef4444' : 'var(--fg-muted)', whiteSpace: 'nowrap' }}>
                        {ticket.slaHoursLeft < 1 ? `${Math.round(ticket.slaHoursLeft * 60)}m` : `${ticket.slaHoursLeft}h`}
                      </span>
                    </div>
                  )}
                  {(ticket.status === 'resolved' || ticket.status === 'closed') && ticket.satisfaction && (
                    <div className="flex items-center gap-0.5">
                      {'★★★★★'.split('').slice(0, ticket.satisfaction).map((_, i) => (
                        <span key={i} style={{ color: '#f59e0b', fontSize: 10 }}>★</span>
                      ))}
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-1.5">
                    {/* Channel */}
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 11, height: 11, color: 'var(--fg-muted)' }}>
                      <path d={channelIcons[ticket.channel]} />
                    </svg>
                    {/* Agent */}
                    {assignedAgent ? (
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
                        style={{ background: assignedAgent.color, fontSize: 9 }}
                        title={assignedAgent.name}
                      >
                        {assignedAgent.initials}
                      </div>
                    ) : (
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                        style={{ border: '1.5px dashed var(--fg-muted)', color: 'var(--fg-muted)', fontSize: 9 }}
                        title="Unassigned"
                      >
                        ?
                      </div>
                    )}
                    <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{ticket.updatedAt}</span>
                  </div>
                </div>

                {/* Unread indicator for new tickets */}
                {ticket.status === 'new' && !ticket.firstResponseAt && (
                  <div
                    className="absolute top-3 right-3 h-2 w-2 rounded-full"
                    style={{ background: '#8b5cf6' }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
