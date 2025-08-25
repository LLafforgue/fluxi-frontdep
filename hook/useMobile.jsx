import { useEffect, useState } from "react"

// hook/useMobile.js
const MOBILE_BREAKPOINT = 1000

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
