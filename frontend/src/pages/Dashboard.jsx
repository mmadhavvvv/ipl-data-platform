import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
    const [winStats, setWinStats] = useState([]);
    const [venueStats, setVenueStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [winsRes, venuesRes] = await Promise.all([
                    api.get('/insights/wins_per_team'),
                    api.get('/insights/venue_stats')
                ]);
                setWinStats(winsRes.data);
                setVenueStats(venuesRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass" style={{ padding: '10px', border: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
                    <p style={{ margin: 0, color: 'var(--primary)' }}>Wins: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Season Insights</h2>
                <p style={{ color: 'var(--text-muted)' }}>Analyzing 2022 Match Data</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Wins per Team */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', height: '400px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Wins per Team</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={winStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="team" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="wins" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Matches per Venue */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', height: '400px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Matches per Venue</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={venueStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="matches"
                                nameKey="venue"
                            >
                                {venueStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
