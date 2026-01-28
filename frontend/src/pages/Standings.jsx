import React, { useEffect, useState } from 'react';
import api from '../api';

const Standings = () => {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const res = await api.get('/standings');
                setStandings(res.data);
            } catch (err) {
                console.error("Failed to fetch standings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Points Table</h2>
                <p style={{ color: 'var(--text-muted)' }}>Indian Premier League 2022 Standings</p>
            </header>

            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <th style={{ padding: '1rem' }}>Pos</th>
                            <th style={{ padding: '1rem' }}>Team</th>
                            <th style={{ padding: '1rem' }}>P</th>
                            <th style={{ padding: '1rem' }}>W</th>
                            <th style={{ padding: '1rem' }}>L</th>
                            <th style={{ padding: '1rem' }}>Pts</th>
                            <th style={{ padding: '1rem' }}>NRR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Loading standings...</td></tr>
                        ) : standings.map((s, index) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', background: index < 4 ? 'rgba(56, 189, 248, 0.03)' : 'transparent' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{index + 1}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={s.team.logo_url} alt={s.team.abbr} style={{ width: '24px', height: '24px' }} />
                                        <span style={{ fontWeight: 600 }}>{s.team.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{s.played}</td>
                                <td style={{ padding: '1rem' }}>{s.win}</td>
                                <td style={{ padding: '1rem' }}>{s.loss}</td>
                                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{s.points}</td>
                                <td style={{ padding: '1rem', color: s.netrr >= 0 ? '#34d399' : '#f87171' }}>{s.netrr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Standings;
