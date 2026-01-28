import React from 'react';
import { LayoutDashboard, Users, Trophy, Table, CircleUser } from 'lucide-react';

const Sidebar = ({ onNavigate, currentPage }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'standings', label: 'Standings', icon: <Table size={20} /> },
        { id: 'matches', label: 'Matches', icon: <Trophy size={20} /> },
        { id: 'teams', label: 'Teams', icon: <Users size={20} /> },
        { id: 'stats', label: 'Player Stats', icon: <CircleUser size={20} /> },
    ];

    return (
        <aside className="glass" style={{
            width: '260px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            position: 'sticky',
            top: 0
        }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    IPL INSIGHTS
                </h1>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            background: currentPage === item.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            color: currentPage === item.id ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {item.icon}
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
