import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsAuthenticated }) {
  const [form, setForm] = useState({
    name: '',
    register_number: '',
    phone_number: '',
    date_of_birth: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage(data.message);
        setIsAuthenticated(true);
        navigate('/protected');
      } else {
        setSuccess(false);
        setMessage(data.message);
      }
    } catch (err) {
      console.log(err.message)
      setSuccess(false);
      setMessage('Error connecting to backend.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Student Verification Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Register Number:</label><br />
          <input type="text" name="register_number" value={form.register_number} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number:</label><br />
          <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} required />
        </div>
        <div>
          <label>Date of Birth:</label><br />
          <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: 16 }}>Verify</button>
      </form>
      {message && (
        <div style={{ marginTop: 20, color: success ? 'green' : 'red' }}>{message}</div>
      )}
    </div>
  );
}

export default LoginPage;
