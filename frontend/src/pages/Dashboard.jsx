import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api';

const COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24', '#34d399', '#a78bfa', '#f87171', '#60a5fa'];

const Dashboard = () => {
    const [winsData, setWinsData] = useState([]);
    const [venueData, setVenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [winsRes, venueRes] = await Promise.all([
                    api.get('/insights/wins_per_team'),
                    api.get('/insights/venue_stats')
                ]);
                setWinsData(winsRes.data);
                setVenueData(venueRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading insights...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>League Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Real-time statistics for IPL 2022 Season</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Wins per Team</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={winsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="team" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Bar dataKey="wins" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Matches by Venue</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={venueData}
                                    dataKey="matches"
                                    nameKey="venue"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={({ name }) => name.length > 20 ? name.split(' ')[0] : name}
                                >
                                    {venueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
