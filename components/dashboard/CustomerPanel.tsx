"use client";

import { useState } from "react";
import { Customer, TicketStatus } from "@/lib/ticketData";

interface CustomerPanelProps {
  customer: Customer;
  onClose: () => void;
  onTicketSelect: (id: string) => void;
}

const planConfig: Record<string, { label: string; color: string; bg: string }> = {
  starter:    { label: 'Starter',    color: '#6b7280', bg: '#f3f4f6' },
  pro:        { label: 'Pro',        color: '#6366f1', bg: '#e0e7ff' },
  enterprise: { label: 'Enterprise', color: '#f59e0b', bg: '#fef3c7' },
};

const statusColor: Record<TicketStatus, string> = {
  new: '#8b5cf6', open: '#3b82f6', pending: '#f59e0b', resolved: '#10b981', closed: '#9ca3af',
};

export function CustomerPanel({ customer, onClose, onTicketSelect }: CustomerPanelProps) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer.notes);
  const pc = planConfig[customer.plan];

  return (
    <div
      className="h-full flex flex-col"
      style={{ width: 272, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4"
        style={{ height: 52, flexShrink: 0, borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, color: 'var(--fg-muted)' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--fg-muted)' }}
          >
            Customer
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 transition-colors"
          style={{ color: 'var(--fg-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Customer identity */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {customer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div
                className="font-semibold text-sm truncate"
                style={{ color: 'var(--fg)', fontFamily: 'var(--font-outfit)' }}
              >
                {customer.name}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--fg-muted)' }}>{customer.company}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: pc.bg, color: pc.color }}
            >
              {pc.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{customer.lifetimeValue}</span>
          </div>
          <a
            href={`mailto:${customer.email}`}
            className="text-xs truncate block transition-colors"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          >
            {customer.email}
          </a>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 grid grid-cols-2 gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          {[
            { label: 'Account Age', value: customer.accountAge },
            { label: 'Total Tickets', value: String(customer.totalTickets) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-3"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>{label}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--fg)', fontFamily: 'var(--font-outfit)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>
              Agent Notes
            </span>
            <button
              onClick={() => setEditingNotes(!editingNotes)}
              className="text-xs px-2 py-0.5 rounded transition-colors"
              style={{ color: 'var(--accent)', background: editingNotes ? 'var(--accent-light)' : 'transparent' }}
            >
              {editingNotes ? 'Save' : 'Edit'}
            </button>
          </div>
          {editingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg p-2.5 text-xs resize-none outline-none"
              style={{
                background: 'var(--internal-bg)',
                border: '1px solid var(--internal-border)',
                color: 'var(--fg)',
              }}
            />
          ) : (
            <div
              className="text-xs rounded-lg p-2.5 cursor-pointer transition-colors"
              style={{
                background: 'var(--internal-bg)',
                border: '1px solid var(--internal-border)',
                color: 'var(--fg)',
                lineHeight: 1.6,
              }}
              onClick={() => setNotesExpanded(!notesExpanded)}
            >
              <p className={notesExpanded ? '' : 'line-clamp-3'}>{notes}</p>
              {notes.length > 80 && (
                <span className="text-xs mt-1 block" style={{ color: 'var(--accent)' }}>
                  {notesExpanded ? 'Show less' : 'Show more'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Previous tickets */}
        <div className="px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-muted)' }}>
            Previous Tickets
          </div>
          <div className="space-y-2">
            {customer.recentTickets.map((rt) => (
              <button
                key={rt.id}
                onClick={() => onTicketSelect(rt.id)}
                className="w-full text-left rounded-lg p-2.5 transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div className="text-xs font-medium mb-1 line-clamp-1" style={{ color: 'var(--fg)' }}>
                  {rt.subject}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: `${statusColor[rt.status]}15`, color: statusColor[rt.status] }}
                  >
                    {rt.status}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{rt.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
