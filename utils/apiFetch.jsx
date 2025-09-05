const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch('https://fluxi-backdep.vercel.app'+url, {
    ...options,
    headers,
  });

  return res.json();
};
export default apiFetch;