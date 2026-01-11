className = "w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
animate = {{ rotate: 360 }}
transition = {{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div >
        );
    }

const statCards = [
    { label: 'Total XP', value: stats?.gamification?.xp || 0, icon: Sparkles, color: 'from-purple-500 to-pink-500', change: '+12%' },
    { label: 'Active Missions', value: missions.filter((m: any) => !m.completed).length, icon: Target, color: 'from-blue-500 to-cyan-500', change: '+3' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+5%' },
    { label: 'Team Rank', value: '#' + (stats?.gamification?.level || 1), icon: Award, color: 'from-orange-500 to-red-500', change: '↑2' },
];

const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 700 },
    { name: 'Sun', value: 900 },
];

return (
    <div className="min-h-screen flex">
        {/* Sidebar */}
        <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 280 : 80 }}
            className="glass border-r border-white/10 p-6 flex flex-col"
        >
            <div className="flex items-center justify-between mb-8">
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl">GrowthEngine</span>
                    </motion.div>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {[
                    { icon: BarChart3, label: 'Dashboard', active: true },
                    { icon: Target, label: 'Missions' },
                    { icon: Users, label: 'Team' },
                    { icon: Award, label: 'Achievements' },
                ].map((item, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                            ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white'
                            : 'hover:bg-white/5 text-white/60'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {sidebarOpen && <span>{item.label}</span>}
                    </motion.button>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-400"
            >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Logout</span>}
            </button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back, <span className="text-gradient">{user.name}</span>
                </h1>
                <p className="text-white/60">Here's what's happening with your growth today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-white/60 text-sm">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-xl font-bold mb-6">Activity Overview</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-xl font-bold mb-6">XP Progress</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#d946ef" strokeWidth={3} dot={{ fill: '#d946ef', r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recommendations & Missions */}
            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        AI Recommendations
                    </h3>
                    <div className="space-y-4">
                        {recommendations.length > 0 ? (
                            recommendations.slice(0, 3).map((rec: any, i: number) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 glass glass-hover rounded-xl cursor-pointer"
                                >
                                    <div className="font-semibold mb-1">{rec.type}</div>
                                    <div className="text-sm text-white/60 mb-2">{rec.reason}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full">
                                            Impact: {rec.impactScore}/10
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-white/40 text-center py-8">No recommendations yet</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-green-400" />
                        Active Missions
                    </h3>
                    <div className="space-y-4">
                        {missions.length > 0 ? (
                            missions.filter((m: any) => !m.completed).slice(0, 3).map((mission: any, i: number) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 glass glass-hover rounded-xl cursor-pointer"
                                >
                                    <div className="font-semibold mb-2">{mission.title || 'Mission'}</div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                            style={{ width: `${(mission.completedSteps / mission.totalSteps) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-white/60">
                                        {mission.completedSteps || 0} / {mission.totalSteps || 0} steps completed
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-white/40 text-center py-8">No active missions</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    </div>
);
}
