// src/components/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { validateEmail, validatePassword } from "../utils/validation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { request, isLoading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await request("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.token) {
        localStorage.setItem("token", `Bearer ${response.token}`);
        if (response.mfaRequired) {
          navigate("/mfa", { state: { qrCode: response.qr_code_base64 } });
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Registration failed: No token received");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err, err.response);
      if (err.response && err.response.status === 400) {
        setError(
          "Invalid input: " + (err.message || "Check your email/password")
        );
      } else if (err.response && err.response.status === 500) {
        setError("Server error: Please try again later");
      } else if (err.message.includes("CORS")) {
        setError("CORS error: Unable to reach server");
      } else {
        setError(`Registration failed: ${err.message || "Unknown error"}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
