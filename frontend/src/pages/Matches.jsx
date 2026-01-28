import React, { useEffect, useState } from 'react';
import api from '../api';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const res = await api.get('/matches', {
                    params: { skip: page * limit, limit: limit }
                });
                setMatches(res.data.matches);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [page]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Fixtures & Results</h2>
                <p style={{ color: 'var(--text-muted)' }}>Comprehensive match history and upcoming schedule</p>
            </header>

            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <th style={{ padding: '1rem' }}>Match</th>
                            <th style={{ padding: '1rem' }}>Venue</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading matches...</td></tr>
                        ) : matches.map((match) => (
                            <tr key={match.match_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{match.teama.abbr} vs {match.teamb.abbr}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{match.subtitle}</div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{match.venue?.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(match.date_start).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 500 }}>{match.result || "Upcoming"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                    Page {page + 1} of {Math.ceil(total / limit)}
                </span>
                <button disabled={(page + 1) * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default Matches;
