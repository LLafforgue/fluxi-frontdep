const apiFetch = async (url, options = {}) => {
  const api = 'http://localhost:3001';
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(api+url, {
    ...options,
    headers,
  });
  
  console.log(res)
   if (res.status === 204) {
      return;
    }

  return res.json();
};
export default apiFetch;