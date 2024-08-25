import { useState } from 'react';

const GitHubProfileFinder = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const fetchGithubUserData = async () => {
        try {
            setLoading(true);
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            const userData = await userRes.json();

            if (userData) {
                setUserData(userData);

                const followersRes = await fetch(`https://api.github.com/users/${username}/followers`);
                const followersData = await followersRes.json();
                setFollowers(followersData);

                setSearchHistory((prevHistory) => {
                    const updatedHistory = [username, ...prevHistory];
                    return updatedHistory.slice(0, 10); // Keep only the last 10 searches
                });

                setLoading(false);
                setUsername("");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const removeHistoryItem = (itemToRemove) => {
        setSearchHistory((prevHistory) =>
            prevHistory.filter((item) => item !== itemToRemove)
        );
    };

    const clearHistory = () => {
        setSearchHistory([]);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">GitHub Profile Finder</h1>

            <div className="w-full max-w-2xl flex space-x-3 mb-8">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    className="flex-grow py-2 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={fetchGithubUserData}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Search
                </button>
            </div>

            {/* Toggle Search History Visibility */}
            <button
                onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                className="text-blue-600 hover:underline mb-4"
            >
                {isHistoryVisible ? "Hide Search History" : "Show Search History"}
            </button>

            {!isHistoryVisible && (
                <div className="w-full max-w-2xl mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search History</h2>
                    <div className="space-y-2 mb-4">
                        {searchHistory.map((historyItem, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                                <button
                                    onClick={() => setUsername(historyItem)}
                                    className="text-blue-600 hover:underline"
                                >
                                    {historyItem}
                                </button>
                                <button
                                    onClick={() => removeHistoryItem(historyItem)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={clearHistory}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Clear History
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center space-y-2">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-gray-600">Loading...</p>
                </div>
            )}

            {userData && !loading && (
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center">
                        <img
                            src={userData.avatar_url}
                            alt={userData.name || "User"}
                            className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-lg mb-4 md:mb-0 md:mr-6"
                        />
                        <div className="flex flex-col items-start">
                            <a
                                href={userData.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-3xl font-extrabold text-blue-700 hover:text-blue-600 transition-colors duration-300 mb-1"
                            >
                                {userData.name || "User Name"}
                            </a>
                            <p className="text-lg text-gray-700 mb-2">@{userData.login}</p>
                            <p className="text-gray-600 mb-4">{userData.bio || "This user has no bio."}</p>
                            <div className="flex space-x-6 mt-4">
                                <a
                                    href={`https://github.com/${userData.login}?tab=repositories`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-500 font-semibold transition-colors duration-300"
                                >
                                    Repositories
                                </a>
                                <a
                                    href={`https://github.com/${userData.login}?tab=projects`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-500 font-semibold transition-colors duration-300"
                                >
                                    Projects
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between text-center mb-6">
                        <div>
                            <p className="text-xl font-semibold text-gray-800">{userData.followers}</p>
                            <p className="text-gray-600">Followers</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-gray-800">{userData.following}</p>
                            <p className="text-gray-600">Following</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-gray-800">{userData.public_repos}</p>
                            <p className="text-gray-600">Repos</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">Followers:</h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {followers.map((follower) => (
                            <div key={follower.id} className="bg-gray-50 shadow-md rounded-lg p-4 flex flex-col items-center">
                                <img
                                    src={follower.avatar_url}
                                    alt={follower.login}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="mt-2 text-center">
                                    <a
                                        href={follower.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {follower.login}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GitHubProfileFinder;
