import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Protected(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const api = 'http://localhost:3001';
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function checkAuth() {
        const token = localStorage.getItem("token");
        const res = await fetch(`${api}/api/check-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status == 401) {
          router.replace("/logout");
        } else {
          setLoading(false); 
        }
      }

      checkAuth();
    }, [router.pathname]);

    if (loading) {
      return <p>Chargement...</p>; 
    }

    return <Component {...props} />;
  };
}
