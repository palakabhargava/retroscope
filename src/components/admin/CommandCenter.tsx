import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Film,
  TrendingUp,
  AlertTriangle,
  Activity,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAnalytics = [
  { date: 'Mon', views: 2400, users: 240, revenue: 2210 },
  { date: 'Tue', views: 1398, users: 221, revenue: 2290 },
  { date: 'Wed', views: 9800, users: 229, revenue: 2000 },
  { date: 'Thu', views: 3908, users: 200, revenue: 2181 },
  { date: 'Fri', views: 4800, users: 220, revenue: 2500 },
  { date: 'Sat', views: 3908, users: 250, revenue: 2100 },
  { date: 'Sun', views: 4800, users: 210, revenue: 2100 },
];

const AdminStats = [
  {
    label: 'Total Views',
    value: '1.2M',
    change: '+12.5%',
    icon: BarChart3,
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    label: 'Active Users',
    value: '24.5K',
    change: '+8.2%',
    icon: Users,
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    label: 'Total Content',
    value: '5,420',
    change: '+142 new',
    icon: Film,
    color: 'from-purple-500/20 to-purple-600/10',
  },
  {
    label: 'Revenue',
    value: '$42.5K',
    change: '+24.1%',
    icon: TrendingUp,
    color: 'from-amber-500/20 to-amber-600/10',
  },
];

const ActiveIssues = [
  { id: 1, type: 'alert', title: '3 Images Failed to Load', severity: 'high' },
  { id: 2, type: 'warning', title: 'High API Latency', severity: 'medium' },
  { id: 3, type: 'info', title: 'Database Backup Completed', severity: 'low' },
];

export function AdminCommandCenter() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Cinematic command room background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border/50 bg-background/40 backdrop-blur-md sticky top-0 z-30"
        >
          <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="font-display text-2xl font-black text-foreground text-glow">
                COMMAND CENTER
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                Operational Dashboard
              </p>
            </div>
            <button className="p-2 rounded-md hover:bg-card transition">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            {AdminStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-6 rounded-lg border border-border/50 bg-gradient-to-br ${stat.color} backdrop-blur-sm overflow-hidden group hover:border-border transition`}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-md bg-background/50 border border-border/30">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Views Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-6 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-bold">Views & Users</h2>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </div>
                <div className="flex gap-2">
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-md text-xs uppercase font-medium transition ${
                        selectedPeriod === period
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h2 className="font-display text-lg font-bold">Revenue</h2>
                <p className="text-xs text-muted-foreground mt-1">Weekly breakdown</p>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Active Issues & Systems */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Active Issues
              </h2>
              <div className="space-y-3">
                {ActiveIssues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-md bg-background/50 border border-border/30 hover:border-border transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{issue.title}</p>
                      <p className={`text-xs mt-1 ${
                        issue.severity === 'high'
                          ? 'text-red-400'
                          : issue.severity === 'medium'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}>
                        {issue.severity.toUpperCase()} PRIORITY
                      </p>
                    </div>
                    <button className="p-1 hover:bg-background rounded-md transition">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                System Health
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'API Uptime', status: '99.98%', color: 'emerald' },
                  { name: 'Database', status: 'Healthy', color: 'emerald' },
                  { name: 'CDN', status: '98.5%', color: 'amber' },
                  { name: 'Cache', status: 'Optimal', color: 'emerald' },
                ].map((system) => (
                  <div key={system.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{system.name}</p>
                      <p className={`text-sm font-medium text-${system.color}-400`}>{system.status}</p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-background/50 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${system.color}-500 to-${system.color}-600`}
                        style={{ width: system.status.includes('%') ? system.status : '100%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
