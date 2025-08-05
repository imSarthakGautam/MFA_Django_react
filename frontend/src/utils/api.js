const BASE_URL = "http://localhost:8000/api"; // Django backend

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  return await res.json();
};

export const verifyMFA = async (token, otp) => {
  const res = await fetch(`${BASE_URL}/mfa/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");

  return await res.json();
};

export const verifyToken = async (token) => {
  const res = await fetch(`${BASE_URL}/verify-token/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok ? await res.json() : { valid: false };
};
