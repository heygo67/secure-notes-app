export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("token");

  const authHeaders = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, { ...options, headers: authHeaders });

  // If token expired, try refresh
  if (res.status === 401) {
    const refreshRes = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
    });

    if (refreshRes.ok) {
      const { token: newToken, refreshToken: newRefresh } = await refreshRes.json();
      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefresh);

      // Retry original request with new token
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      // Optional: logout or redirect to login
      throw new Error("Refresh token expired or invalid");
    }
  }

  return res;
}
