import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MFAForm from "../components/MFAForm";

export default function MFA() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrCode = location.state?.qrCode;

  useEffect(() => {
    if (!qrCode) {
      console.error("No QR code in location.state");
      navigate("/register");
    }
  }, [qrCode, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MFAForm qrCode={qrCode} />
    </div>
  );
}
