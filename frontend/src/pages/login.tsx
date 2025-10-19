import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import FormCard from '../components/FormCard';
import { config } from '../utils/config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessage('Please fill in both fields');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${config.apiBackend}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username, 
          password 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('from', 'Login');
        
        setUsername('');
        setPassword('');

        navigate('/dashboard');
        
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login Failed');
      }

    } catch (error) {
      console.error('Error occurred', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <FormCard title="Login" onSubmit={handleSubmitLogin}>
        <FormInput
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
          placeholder="Enter your username"
          minLength={6}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          placeholder="Enter your password"
          minLength={6}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className="text-center text-sm text-red-600">
            {message}
          </p>
        )}
      </FormCard>
    </div>
  );
};

export default Login;