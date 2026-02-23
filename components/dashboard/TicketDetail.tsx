"use client";

import { useState } from "react";
import { Ticket, Priority, TicketStatus, agents, cannedResponses } from "@/lib/ticketData";

interface TicketDetailProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onAssign: (id: string, agentId: string) => void;
  onAddMessage: (ticketId: string, content: string, isInternal: boolean) => void;
  showCustomerPanel: boolean;
  onToggleCustomer: () => void;
}

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: '#ef4444', bg: '#fef2f2' },
  high:   { label: 'High',   color: '#f97316', bg: '#fff7ed' },
  normal: { label: 'Normal', color: '#3b82f6', bg: '#eff6ff' },
  low:    { label: 'Low',    color: '#9ca3af', bg: '#f9fafb' },
};

const statusConfig: Record<TicketStatus, { label: string; color: string; next?: TicketStatus }> = {
  new:      { label: 'New',      color: '#8b5cf6', next: 'open' },
  open:     { label: 'Open',     color: '#3b82f6', next: 'pending' },
  pending:  { label: 'Pending',  color: '#f59e0b', next: 'resolved' },
  resolved: { label: 'Resolved', color: '#10b981', next: 'closed' },
  closed:   { label: 'Closed',   color: '#6b7280' },
};

const channelLabel: Record<string, string> = { email: 'Email', chat: 'Live Chat', phone: 'Phone' };

export function TicketDetail({
  ticket, onStatusChange, onPriorityChange, onAssign,
  onAddMessage, showCustomerPanel, onToggleCustomer,
}: TicketDetailProps) {
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showCanned, setShowCanned] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const sc = statusConfig[ticket.status];
  const pc = priorityConfig[ticket.priority];
  const assignedAgent = ticket.assignedTo ? agents.find((a) => a.id === ticket.assignedTo) : null;
  const slaPercent = Math.min(100, ((ticket.slaTotal - ticket.slaHoursLeft) / ticket.slaTotal) * 100);
  const slaCritical = ticket.slaHoursLeft < 2 && ticket.status !== 'resolved' && ticket.status !== 'closed';

  const handleSend = () => {
    if (!replyText.trim()) return;
    onAddMessage(ticket.id, replyText.trim(), isInternal);
    setReplyText('');
    setIsInternal(false);
  };

  const insertCanned = (body: string) => {
    const filled = body
      .replace('{{customer_name}}', ticket.customerName.split(' ')[0])
      .replace('{{agent_name}}', assignedAgent?.name || 'Support Team');
    setReplyText(filled);
    setShowCanned(false);
  };

  const statuses: TicketStatus[] = ['new', 'open', 'pending', 'resolved', 'closed'];
  const priorities: Priority[] = ['urgent', 'high', 'normal', 'low'];

  return (
    <div className="flex h-full flex-col flex-1 min-w-0" style={{ background: 'var(--bg)' }}>
      {/* Ticket header */}
      <div
        className="px-5 pt-4 pb-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}
      >
        {/* Top row: breadcrumb + Customer toggle */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg-panel)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          >
            #{ticket.number}
          </span>
          <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{channelLabel[ticket.channel]}</span>
          <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>Opened {ticket.createdAt}</span>
          <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>Updated {ticket.updatedAt}</span>

          {/* Customer toggle — anchored to the right of meta row */}
          <button
            onClick={onToggleCustomer}
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0"
            style={{
              background: showCustomerPanel ? 'var(--accent)' : 'var(--bg-panel)',
              color: showCustomerPanel ? 'white' : 'var(--fg-muted)',
              border: `1px solid ${showCustomerPanel ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Customer
          </button>
        </div>

        {/* Subject */}
        <h1
          className="mb-3 leading-snug"
          style={{ color: 'var(--fg)', fontFamily: 'var(--font-outfit)', fontSize: 17, fontWeight: 700 }}
        >
          {ticket.subject}
        </h1>

        {/* Controls row — status / priority / assign on one line, tags below */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusMenu(!showStatusMenu); setShowPriorityMenu(false); setShowAssignMenu(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: `${sc.color}15`,
                color: sc.color,
                border: `1px solid ${sc.color}30`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
              {sc.label}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 10, height: 10 }}>
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div
                className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-20 py-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 130, boxShadow: '0 8px 24px rgba(30,27,75,0.12)' }}
              >
                {statuses.map((s) => {
                  const cfg = statusConfig[s];
                  return (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(ticket.id, s); setShowStatusMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors"
                      style={{ color: s === ticket.status ? cfg.color : 'var(--fg)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-panel)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Priority */}
          <div className="relative">
            <button
              onClick={() => { setShowPriorityMenu(!showPriorityMenu); setShowStatusMenu(false); setShowAssignMenu(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.color}30` }}
            >
              {pc.label}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 10, height: 10 }}>
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {showPriorityMenu && (
              <div
                className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-20 py-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 120, boxShadow: '0 8px 24px rgba(30,27,75,0.12)' }}
              >
                {priorities.map((p) => {
                  const cfg = priorityConfig[p];
                  return (
                    <button
                      key={p}
                      onClick={() => { onPriorityChange(ticket.id, p); setShowPriorityMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium"
                      style={{ color: p === ticket.priority ? cfg.color : 'var(--fg)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-panel)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assign */}
          <div className="relative">
            <button
              onClick={() => { setShowAssignMenu(!showAssignMenu); setShowStatusMenu(false); setShowPriorityMenu(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--bg-panel)', color: 'var(--fg)', border: '1px solid var(--border)' }}
            >
              {assignedAgent ? (
                <>
                  <div
                    className="flex h-4 w-4 items-center justify-center rounded-full text-white font-bold"
                    style={{ background: assignedAgent.color, fontSize: 8 }}
                  >
                    {assignedAgent.initials}
                  </div>
                  {assignedAgent.name}
                </>
              ) : (
                <>
                  <div
                    className="flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ border: '1.5px dashed var(--fg-muted)', fontSize: 9, color: 'var(--fg-muted)' }}
                  >
                    ?
                  </div>
                  Unassigned
                </>
              )}
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 10, height: 10 }}>
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {showAssignMenu && (
              <div
                className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-20 py-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 160, boxShadow: '0 8px 24px rgba(30,27,75,0.12)' }}
              >
                <button
                  onClick={() => { onAssign(ticket.id, ''); setShowAssignMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs"
                  style={{ color: 'var(--fg-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-panel)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Unassign
                </button>
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => { onAssign(ticket.id, agent.id); setShowAssignMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs"
                    style={{ color: agent.id === ticket.assignedTo ? 'var(--accent)' : 'var(--fg)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-panel)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full text-white font-bold flex-shrink-0"
                      style={{ background: agent.color, fontSize: 8 }}
                    >
                      {agent.initials}
                    </div>
                    <span className="flex-1 truncate">{agent.name}</span>
                    <span style={{ color: 'var(--fg-muted)' }}>{agent.openTickets}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1 flex-wrap">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full cursor-pointer"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* SLA bar */}
        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>
              SLA
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${slaPercent}%`,
                  background: slaCritical ? '#ef4444' : slaPercent > 75 ? '#f59e0b' : '#10b981',
                }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: slaCritical ? '#ef4444' : 'var(--fg-muted)', whiteSpace: 'nowrap' }}>
              {ticket.slaHoursLeft < 1
                ? `${Math.round(ticket.slaHoursLeft * 60)}m left`
                : `${ticket.slaHoursLeft}h left`}
            </span>
            {!ticket.firstResponseAt && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#fef2f2', color: '#ef4444' }}
              >
                No first response
              </span>
            )}
          </div>
        )}

        {/* Satisfaction */}
        {ticket.satisfaction && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>Customer satisfaction:</span>
            <div className="flex">
              {'★★★★★'.split('').map((_, i) => (
                <span key={i} style={{ color: i < ticket.satisfaction! ? '#f59e0b' : 'var(--border)', fontSize: 14 }}>★</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {ticket.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isAgent && !msg.isInternal ? 'flex-row-reverse' : ''}`}>
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{
                background: msg.isAgent
                  ? (agents.find((a) => a.initials === msg.initials)?.color || 'var(--accent)')
                  : '#94a3b8',
              }}
            >
              {msg.initials}
            </div>
            <div className={`max-w-[70%] ${msg.isAgent && !msg.isInternal ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>{msg.author}</span>
                {msg.isInternal && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ background: 'var(--internal-bg)', color: '#92400e', border: '1px solid var(--internal-border)' }}
                  >
                    Internal note
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{msg.timestamp}</span>
              </div>
              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: msg.isInternal
                    ? 'var(--internal-bg)'
                    : msg.isAgent
                    ? 'var(--accent)'
                    : 'var(--bg-card)',
                  color: msg.isInternal ? '#78350f' : msg.isAgent ? 'white' : 'var(--fg)',
                  border: msg.isInternal
                    ? '1px solid var(--internal-border)'
                    : msg.isAgent
                    ? 'none'
                    : '1px solid var(--border)',
                  borderTopLeftRadius: !msg.isAgent || msg.isInternal ? 4 : undefined,
                  borderTopRightRadius: msg.isAgent && !msg.isInternal ? 4 : undefined,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply box */}
      <div
        className="flex-shrink-0 px-6 py-4"
        style={{
          borderTop: '1px solid var(--border)',
          background: isInternal ? 'var(--internal-bg)' : 'var(--bg-card)',
          borderTopColor: isInternal ? 'var(--internal-border)' : 'var(--border)',
        }}
      >
        {/* Toggle internal/reply + canned responses */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setIsInternal(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: !isInternal ? 'var(--accent)' : 'var(--bg-panel)',
              color: !isInternal ? 'white' : 'var(--fg-muted)',
              border: `1px solid ${!isInternal ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
            </svg>
            Reply
          </button>
          <button
            onClick={() => setIsInternal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: isInternal ? '#f59e0b' : 'var(--bg-panel)',
              color: isInternal ? 'white' : 'var(--fg-muted)',
              border: `1px solid ${isInternal ? '#f59e0b' : 'var(--border)'}`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Internal Note
          </button>

          {/* Canned responses */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowCanned(!showCanned)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: showCanned ? 'var(--accent-light)' : 'var(--bg-panel)',
                color: showCanned ? 'var(--accent)' : 'var(--fg-muted)',
                border: `1px solid ${showCanned ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              Canned Responses
            </button>
            {showCanned && (
              <div
                className="absolute bottom-full right-0 mb-2 rounded-xl overflow-hidden z-20 py-1"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  minWidth: 240,
                  boxShadow: '0 8px 32px rgba(30,27,75,0.15)',
                }}
              >
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>
                  Canned Responses
                </div>
                {cannedResponses.map((cr) => (
                  <button
                    key={cr.id}
                    onClick={() => insertCanned(cr.body)}
                    className="w-full text-left px-3 py-2.5 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-panel)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>{cr.title}</div>
                    <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--fg-muted)' }}>{cr.body.slice(0, 50)}…</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text area */}
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={isInternal ? 'Add an internal note (only visible to agents)...' : `Reply to ${ticket.customerName}...`}
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
          style={{
            background: isInternal ? 'rgba(255,255,255,0.6)' : 'var(--bg)',
            border: `1px solid ${isInternal ? 'var(--internal-border)' : 'var(--border)'}`,
            color: 'var(--fg)',
            lineHeight: 1.6,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = isInternal ? '#f59e0b' : 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = isInternal ? 'var(--internal-border)' : 'var(--border)')}
        />

        {/* Send */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            {isInternal ? '🔒 Only visible to your team' : `✉️ Sending to ${ticket.customerEmail}`}
          </div>
          <div className="flex items-center gap-2">
            {sc.next && (
              <button
                onClick={() => {
                  handleSend();
                  onStatusChange(ticket.id, sc.next!);
                }}
                disabled={!replyText.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                style={{
                  background: 'var(--bg-panel)',
                  color: 'var(--fg)',
                  border: '1px solid var(--border)',
                }}
              >
                Reply & Set {statusConfig[sc.next].label}
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!replyText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
              style={{
                background: isInternal ? '#f59e0b' : 'var(--accent)',
                color: 'white',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              {isInternal ? 'Add Note' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>

      {/* Click-away to close dropdowns */}
      {(showStatusMenu || showPriorityMenu || showAssignMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowStatusMenu(false); setShowPriorityMenu(false); setShowAssignMenu(false); }}
        />
      )}
    </div>
  );
}
