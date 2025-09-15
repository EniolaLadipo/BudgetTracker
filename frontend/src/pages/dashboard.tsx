const Dashboard = () => {

    const id = localStorage.getItem('user_id');
    const from = localStorage.getItem('from');

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col">
                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">Page in production...</h1>
                </div>

                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">To verify access token: {id}</h1>
                </div>

                <div className="bg-white p-8 rounded-md shadow-md w-96">
                    <h1 className="text-2xl font-bold text-center">Transitioned from: {from} page</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;