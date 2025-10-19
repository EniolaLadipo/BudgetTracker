import { config } from '../utils/config';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const csrfToken = config.getCookie('csrf_access_token'); // helper to read cookies

    const [barChartData, setBarChartData] = useState([]);
    const [itemAdd, setItemAdd] = useState('');
    const [amountAdd, setAmountAdd] = useState(0.0);
    const [categoryAdd, setCategoryAdd] = useState('');
    const [message, setMessage] = useState('');

    const getTransactions = async () => {
        try {
            const response = await fetch(`${config.apiBackend}/transactions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CRSF-Token': csrfToken || ''
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBarChartData(data);

            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to retrieve transactions');
            }

        } catch (error) {
            console.error('Error occurred', error);
            setMessage('Network error... Please try again')
        }

    };

    const addTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!itemAdd || !amountAdd || !categoryAdd) {
            setMessage('All fields must be filled in');
            return;
        }

        try {
            const response = await fetch(`${config.apiBackend}/transactions/add`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || ''
                },
                body: JSON.stringify({
                    "item": itemAdd,
                    "amount": amountAdd,
                    "category": categoryAdd
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Message: ', data.message);
                getTransactions();
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to add new Transaction')
            }
            
        } catch (error) {
            console.error('Error occurred', error);
            setMessage('Network error... Please try again');
        }

    };

    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Budget Tracker</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex gap-4">
                <div className="flex flex-col items-start p-4 space-y-4 w-1/2 border-4">
                    {/* Top box - 50% width */}
                    <div className="w-full h-96 border-4 border-blue-500">
                        <ResponsiveContainer width="100%">
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#8884d8" />
                            </BarChart>
                            </ResponsiveContainer>

                    </div>

                    {/* Bottom row - two boxes */}
                    <div className="w-full flex space-x-4">
                        <div className="w-1/2 flex flex-col bg-green-400 h-64 p-2">
                            <h2>Add Transaction box</h2>
                            <form onSubmit={addTransaction} className="flex flex-col space-y-4">
                                <input
                                    type="text"
                                    placeholder="Item"
                                    value={itemAdd}
                                    onChange={(e) => setItemAdd(e.target.value)}
                                    className="p-2 rounded border border-gray-300"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount"
                                    value={amountAdd}
                                    onChange={(e) => setAmountAdd(parseFloat(e.target.value))}
                                    className="p-2 rounded border border-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={categoryAdd}
                                    onChange={(e) => setCategoryAdd(e.target.value)}
                                    className="p-2 rounded border border-gray-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                        <div className="w-1/2 flex bg-red-400 h-64 p-2">
                        Delete Transaction box
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start p-4 space-y-4 w-1/2 border-4">
                    Add pie chart
                </div>
            </div>
        </div>
    );
};

export default Dashboard;