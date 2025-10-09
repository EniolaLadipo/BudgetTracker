import { config } from '../utils/config';
import { useState, useEffect } from 'react';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const getDashboardData = async () => {
            const response = await fetch(`${config.apiBackend}/dashboard`, {
                credentials: 'include'
            });
            const data = await response.json();
            setUser(data.logged_in_as);
            setStatus(data.status);
        };

        getDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col">
                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">Page in production...</h1>
                </div>

                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">To verify access token, the verified user is: {user}</h1>
                </div>

                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">Status message from : {status} page</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;