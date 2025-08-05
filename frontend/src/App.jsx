import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './routes/Register';
import Login from './routes/Login';
import MFA from './routes/MFA';
import Dashboard from './routes/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mfa" element={<MFA />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}