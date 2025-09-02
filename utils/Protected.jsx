import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Protected(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {

        async function checkAuth(){
        
            const token = localStorage.getItem("token");
            const res = await fetch("https://fluxi-backdep.vercel.app/api/check-token", {
            headers: { Authorization: `Bearer ${token}` },
            });

            // If token is invalid
            if (res.status == 401) {
            router.replace("/logout");
            }
        }

        checkAuth()

        }, []);

    return <Component {...props} />;
  };
}
