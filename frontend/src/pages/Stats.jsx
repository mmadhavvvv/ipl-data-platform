import React, { useEffect, useState } from 'react';
import api from '../api';

const Stats = () => {
    const [batting, setBatting] = useState([]);
    const [bowling, setBowling] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [batRes, bowlRes] = await Promise.all([
                    api.get('/stats/batting'),
                    api.get('/stats/bowling')
                ]);
                setBatting(batRes.data);
                setBowling(bowlRes.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Player Statistics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Top performers for the 2022 season</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Batting Stats */}
                <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', background: 'linear-gradient(to right, #fbbf24, #f59e0b)', color: 'white' }}>
                        <h3 style={{ margin: 0 }}>Orange Cap (Most Runs)</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                <th style={{ padding: '0.75rem 1rem' }}>Player</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Runs</th>
                                <th style={{ padding: '0.75rem 1rem' }}>S/R</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : batting.map((p) => (
                                <tr key={p.name} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.team_abbr}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{p.runs}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{p.strike_rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bowling Stats */}
                <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', background: 'linear-gradient(to right, #a78bfa, #8b5cf6)', color: 'white' }}>
                        <h3 style={{ margin: 0 }}>Purple Cap (Most Wickets)</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                <th style={{ padding: '0.75rem 1rem' }}>Player</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Wickets</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Avg</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : bowling.map((p) => (
                                <tr key={p.name} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.team_abbr}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{p.wickets}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{p.average}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stats;
