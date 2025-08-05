// src/components/MFA.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function MFA() {
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const { request, isLoading } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const qrCode = location.state?.qrCode; // Get QR code from registration

  useEffect(() => {
    if (!qrCode) {
      setError('No QR code provided. Please register again.');
      navigate('/register');
    }
  }, [qrCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!totpCode) {
      setError('Please enter a TOTP code');
      return;
    }

    try {
      const response = await request('/api/v1/auth/mfa/verify', {
        method: 'POST',
        body: JSON.stringify({ totp_code: totpCode }),
      });

      if (response.success) {
        navigate('/dashboard');
      } else {
        setError('MFA verification failed');
      }
    } catch (err) {
      console.error('MFA verification error:', err);
      if (err.response && err.response.status === 400) {
        setError('Invalid TOTP code');
      } else if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please log in again');
        navigate('/login');
      } else {
        setError(`Verification failed: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Set Up Two-Factor Authentication</h2>
      {error && <p className="text-red-500">{error}</p>}
      {qrCode ? (
        <div className="text-center">
          <p className="text-sm mb-4">Scan this QR code with your authenticator app:</p>
          <img src={`data:image/png;base64,${qrCode}`} alt="MFA QR Code" className="mx-auto" />
        </div>
      ) : (
        <p className="text-red-500">Loading QR code...</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">TOTP Code</label>
          <input
            type="text"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !qrCode}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}