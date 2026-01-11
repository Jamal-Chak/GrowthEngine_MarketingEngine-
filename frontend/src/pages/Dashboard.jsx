import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                const orgId = user?.orgId || 'default-org';
                console.log('Fetching recommendations for:', orgId);

                const response = await api.get(`/recommendations?orgId=${orgId}`);
                console.log('API Response:', response.data);

                // Handle both old and new response formats
                const data = response.data.data || response.data;
                setRecommendations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setError(error.message || 'Failed to load recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-blue-600">GrowthEngine</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700">Welcome, {user?.email}</span>
                            <button onClick={logout} className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg min-h-96 p-4">
                        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading recommendations...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">Error: {error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {recommendations.map((rec) => (
                                    <div key={rec._id} className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {rec.type.toUpperCase()}
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {rec.impactScore} Impact
                                            </dd>
                                            <p className="mt-2 text-gray-600">{rec.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recommendations yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
