import { config } from '../utils/config';
import type { Transaction, BarChartData } from '../utils/types';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const csrfToken = config.getCookie('csrf_access_token'); // helper to read cookies

    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [itemAdd, setItemAdd] = useState<string>('');
    const [amountAdd, setAmountAdd] = useState<number>(0.0);
    const [categoryAdd, setCategoryAdd] = useState<string>("");

    const [transactionToDelete, setTransactionToDelete] = useState<string>("");
    const [message, setMessage] = useState('');

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);


    const colors = [
    "#8884d8", // purple
    "#82ca9d", // green
    "#ffc658", // yellow
    "#ff8042", // orange
    "#a4de6c", // light green
    "#d0ed57", // lime
    "#8dd1e1", // light blue
    "#ffbb28", // amber
    "#e06666", // red
    "#c49c94", // brown
    "#b19cd9", // lavender
    "#ff9ff3", // pink
    "#6c5ce7", // deep purple
    "#00b894", // teal
    "#fd79a8", // hot pink
    ];

    const getTransactions = async () => {
        try {
            const response = await fetch(`${config.apiBackend}/transactions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || ''
                }
            });

            if (response.ok) {
                const data: Transaction[] = await response.json();
                setTransactionData(data)
                const groupedData = groupTransactionsByCategory(data)
                setBarChartData(groupedData);
                console.log("Current BarChart Data: ", [...data]);

            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to retrieve transactions');
            }

        } catch (error) {
            console.error('Error occurred', error);
            setMessage('Network error... Please try again');
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
                setMessage(errorData.message || 'Failed to add new Transaction');
            }
            
        } catch (error) {
            console.error('Error occurred', error);
            setMessage('Network error... Please try again');
        }
    };

    const deleteTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!transactionToDelete) {
            setMessage("Transaction was not selected")
            return;
        }

        try {
            const response = await fetch(`${config.apiBackend}/transactions/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || ''
                },
                body: JSON.stringify({
                    transaction: transactionToDelete
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Message: ', data.message);
                getTransactions();

            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to delete transaction');
            }

        } catch (error) {
            console.error('Error occurred: ', error);
            setMessage('Network error... Please try again');
        }
    }

    function groupTransactionsByCategory(transactions: Transaction[]): BarChartData[] {
        const grouped: Record<string, BarChartData> = {};

        transactions.forEach((t) => {
            if (!grouped[t.category]) {
                grouped[t.category] = { category: t.category };
            }
            
            const currentAmount = grouped[t.category][t.item] as number || 0;
            grouped[t.category][t.item] = currentAmount + t.amount;
        });

        return Object.values(grouped);
    }

    const getAllItems = () => {
        if (barChartData.length === 0) return [];
        
        const itemsSet = new Set<string>();
        barChartData.forEach(categoryData => {
            Object.keys(categoryData).forEach(key => {
                if (key !== 'category') {
                    itemsSet.add(key);
                }
            });
        });
        
        return Array.from(itemsSet);
    };

    const allItems = getAllItems()
    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Budget Tracker</h1>

            <div className="w-full h-8 border-2 border-gray-600 mb-8">
                <a href="" className="font-bold ">Settings</a>
            </div>

            {/*Main box*/}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex w-full gap-4">

                {/*Left box*/}
                <div className="flex flex-col items-start p-4 space-y-4 w-3/5 border-4">
                    {/*Top left box | Stacked Bar Chart*/}
                    <div className="w-full h-[500px] border rounded-lg shadow-lg border-gray-200">
                        <ResponsiveContainer width="100%">
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis 
                                    tickFormatter={(value) => formatCurrency(value)}
                                    label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip />
                                <Legend />
                                {allItems.map((item, i) => (
                                    <Bar
                                        key={item}
                                        dataKey={item}
                                        stackId="a"
                                        fill={colors[i % colors.length]}
                                        name={item}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bottom row - two boxes */}
                    <div className="w-full flex space-x-2">
                        <div className="w-1/2 flex flex-col bg-green-100 h-fit p-2 rounded-lg shadow-md border border-gray-100">
                            <h2 className="font-bold ml-2 mb-2 text-lg">Add Transaction</h2>
                            <form onSubmit={addTransaction} className="flex flex-col space-y-4">
                                <input
                                    type="text"
                                    placeholder="Item"
                                    value={itemAdd}
                                    onChange={(e) => setItemAdd(e.target.value)}
                                    className="p-2 rounded-lg border border-gray-100"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount ()"
                                    value={amountAdd}
                                    onChange={(e) => setAmountAdd(parseFloat(e.target.value))}
                                    className="p-2 rounded-lg border border-gray-100"
                                />

                                <select
                                    value={categoryAdd}
                                    onChange={(e) => setCategoryAdd(e.target.value)}
                                    className="p-2 rounded-lg border border-gray-100"
                                >
                                    <option value="" disabled>Select a category...</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                        {/*Delete Box*/}
                        <div className="w-1/2 flex flex-col bg-red-300 rounded-lg h-fit p-2 shadow-md">
                            <h2 className="font-bold ml-2 mb-2 text-lg">Delete Transaction</h2>
                            <form onSubmit={deleteTransaction} className="flex flex-col space-y-4">
                                <select
                                value={transactionToDelete}
                                onChange={(e) => setTransactionToDelete(e.target.value)}
                                className="p-2 rounded-lg border border-gray-100"
                                >
                                {/*Load transaction history*/}
                                <option value="" disabled>Select a transaction...</option>

                                {transactionData.map((t) => (
                                <option value={t.id}>{t.category} - {t.item} - {formatCurrency(t.amount)} | {t.created_at}</option>
                                ))}
                                </select>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                                >
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start p-4 space-y-4 w-2/5 border-4">
                    Add pie chart
                </div>
            </div>
        </div>
    );
};

export default Dashboard;