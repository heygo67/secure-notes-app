import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email and password cannot be empty.");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      const { token, refreshToken } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      onRegisterSuccess();  // Let App.js know we're logged in
      navigate("/notes"); // Navigate to notes page after success
    } else {
      alert(data.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Register</button>
      <p>Already have an account? <button type="button" onClick={() => navigate("/login")} className="link-button">Log in</button></p>
    </form>
  );
}
