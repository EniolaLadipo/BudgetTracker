import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import FormCard from '../components/FormCard';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessage('Please fill in both fields');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        console.log("Account successfully created");
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('from', 'Register');
        
        setUsername('');
        setPassword('');

        navigate('/dashboard');
        
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Registration failed');
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
      <FormCard title="Register" onSubmit={handleSubmitRegister}>
          <FormInput
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your username"
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
          />

          <FormButton>
            {isLoading ? 'Registering...' : 'Register'}
          </FormButton>

          {message && (
            <p className="text-center text-sm text-red-600">
              {message}
            </p>
          )}
        </FormCard>
    </div>
  );
};

export default Register;