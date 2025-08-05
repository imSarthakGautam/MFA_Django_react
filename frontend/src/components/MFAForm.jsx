import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import QRCode from "react-qr-code";

export default function MFAForm({ qrCode: qrCodeProp }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { request, isLoading } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const qrCode = qrCodeProp || location.state?.qrCode; // Use prop or state

  useEffect(() => {
    if (!qrCode) {
      setError("No QR code provided. Please register again.");
      setTimeout(() => navigate("/register"), 3000);
    }
  }, [qrCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      const response = await request("/api/v1/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ totp_code: code }),
      });

      if (response.success) {
        navigate("/dashboard");
      } else {
        setError("MFA verification failed");
      }
    } catch (err) {
      console.error("MFA verification error:", err);
      if (err.response && err.response.status === 400) {
        setError("Invalid TOTP code");
      } else if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please log in again");
        navigate("/login");
      } else if (err.response && err.response.status === 404) {
        setError("Endpoint not found. Please contact support.");
      } else {
        setError(`Verification failed: ${err.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {qrCode ? (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold mb-4">
            Set Up Two-Factor Authentication
          </h2>
          <p className="mb-4">Scan this QR code with your authenticator app</p>
          <QRCode value={qrCode} size={200} />
        </div>
      ) : (
        <p className="text-red-500">Loading QR code...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Enter MFA Code</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium">6-digit Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            maxLength={6}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !qrCode}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
