export default function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
