"use client";

import { agents } from "@/lib/ticketData";

type NavView = 'inbox' | 'all' | 'mine' | 'team' | 'reports';

interface AppSidebarProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  currentAgentId: string;
  onAgentChange: (id: string) => void;
  urgentCount: number;
}

const navItems: { id: NavView; label: string; icon: string; count?: number }[] = [
  { id: 'inbox', label: 'Inbox', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z', count: 4 },
  { id: 'all', label: 'All Tickets', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z', count: 7 },
  { id: 'mine', label: 'My Tickets', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z', count: 3 },
  { id: 'team', label: 'Team View', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id: 'reports', label: 'Reports', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
];

const statusColors: Record<string, string> = {
  online: '#10b981',
  away: '#f59e0b',
  offline: '#9ca3af',
};

export function AppSidebar({ activeView, onViewChange, currentAgentId, onAgentChange, urgentCount }: AppSidebarProps) {
  return (
    <div
      className="flex h-full flex-col"
      style={{ width: 220, background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-4 flex items-center" style={{ height: 52, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: 'var(--accent)' }}
          >
            TQ
          </div>
          <div>
            <div className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>TicketQ</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Support Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
              style={{
                background: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 17, height: 17, flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.id === 'inbox' && urgentCount > 0 && (
                <span
                  className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  {urgentCount}
                </span>
              )}
              {item.count !== undefined && !(item.id === 'inbox' && urgentCount > 0) && (
                <span
                  className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
                  style={{
                    background: active ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.3)',
                    color: active ? 'white' : '#a5b4fc',
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Agent Team */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
          Team
        </div>
        <div className="space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onAgentChange(agent.id === currentAgentId ? '' : agent.id)}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all"
              style={{
                background: currentAgentId === agent.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentAgentId !== agent.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (currentAgentId !== agent.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div className="relative">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ background: agent.color }}
                >
                  {agent.initials}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#1e1b4b]"
                  style={{ background: statusColors[agent.status] }}
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>{agent.name}</div>
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{agent.openTickets}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
