import React, { useEffect, useState } from 'react';
import api from '../api';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await api.get('/teams');
                setTeams(res.data);
            } catch (err) {
                console.error("Failed to fetch teams", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>IPL Franchises</h2>
                <p style={{ color: 'var(--text-muted)' }}>The ten teams competing in the 2022 season</p>
            </header>

            {loading ? (
                <div>Loading teams...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {teams.map((team) => (
                        <div key={team.tid} className="glass" style={{
                            padding: '2rem',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            transition: 'transform 0.3s',
                            cursor: 'pointer'
                        }}>
                            <img src={team.logo_url} alt={team.abbr} style={{ width: '80px', height: '80px', marginBottom: '1rem' }} />
                            <h3 style={{ margin: 0 }}>{team.title}</h3>
                            <p className="gradient-text" style={{ fontWeight: 700, fontSize: '1.2rem', margin: '0.5rem 0' }}>{team.abbr}</p>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{team.alt_name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Teams;
