import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Budget Tracker</h1>
        <div className="flex justify-center space-x-4">

          <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-lg transition"
          onClick={() => navigate('/register')}
          >
            Register
          </button>
          
          <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg text-lg transition"
          onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
