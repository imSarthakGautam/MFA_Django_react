import { useState, useEffect } from 'react';
import MFAForm from '../components/MFAForm';
import { useApi } from '../hooks/useApi';

export default function MFA() {
  const [qrCode, setQrCode] = useState(null);
  const { request } = useApi();

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await request('/api/auth/mfa-setup');
        if (response.qrCode) {
          setQrCode(response.qrCode);
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };
    fetchQrCode();
  }, [request]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MFAForm qrCode={qrCode} />
    </div>
  );
}