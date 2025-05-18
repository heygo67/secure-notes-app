import { useState } from "react";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("token", token);
      onLoginSuccess();  // let App.js know we're logged in
    } else {
      alert("Login failed.");
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
    </form>
  );
}
