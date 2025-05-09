// useIsMobile.js
import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkScreen = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };
  
      checkScreen(); // Initial check
      window.addEventListener("resize", checkScreen);
  
      return () => {
        window.removeEventListener("resize", checkScreen);
      };
    }, [breakpoint]);
  
    return isMobile;
  }
