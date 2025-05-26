import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email and password are required.");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
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
      onLoginSuccess();  // Let App.js know we're logged in
      navigate("/notes");
    } else {
      alert(data.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <button type="submit">Log In</button>
      <p>Don't have an account? <button type="button" onClick={() => navigate("/register")} className="link-button">Register</button></p>
    </form>
  );
}
