'use client'
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie"
import StorageAccessRequest from "@/components/StorageAccessRequest"
import Image from 'next/image'
import Logo from '../components/imgs/biglogo.png'
import Loader from "@/components/Loadercomp"
export default function Startpage() {
    const router = useRouter();
    const [loading,setLoading] = useState(false)
    const [loadingMsg,setLoadingMsg] = useState('')
    const [showStorageAccess, setShowStorageAccess] = useState(false);
    const [error, setError] = useState('');
    const routeToLogin = ()=>{
        router.push('/signin')
    }

    
    const handleRouting = async () => {
        setLoading(true);
        setError(""); // Clear previous errors
    
        const uid = Cookies.get("uid");
    
        if (uid) {
            console.log(`User already logged in with UID: ${uid}`);
            router.push("/chat");
            return; // No need to set loading false here since we're navigating away
        }
    
        // Show a message if request takes too long
        const timeoutMessage = setTimeout(() => {
            setLoadingMsg("Hold on! Server is starting up...");
        }, 40000); // 40 seconds
    
        try {
            console.log("Routing started...");
            const serverurl = process.env.NEXT_PUBLIC_SERVER_URL;
            console.log(serverurl);
    
            const res = await fetch(`${serverurl}/auth/loginAnonymously`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
    
            clearTimeout(timeoutMessage); // Clear timeout if request completes early
    
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(`Error ${res.status}: ${errorMessage}`);
            }
    
            // Poll for `uid` every 500ms, max 6 seconds (12 attempts)
            let attempts = 12;
            const interval = setInterval(() => {
                const uid = Cookies.get("uid");
                if (uid) {
                    console.log(`UID found: ${uid}`);
                    clearInterval(interval);
                    setLoading(false);
                    router.push("/chat");
                } else if (attempts <= 0) {
                    clearInterval(interval);
                    setError("Failed to retrieve session. Please refresh.");
                    setLoading(false);
                }
                console.log(uid||'cant access ')
                attempts--;
            }, 5000);
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Failed to login. Please try again.");
            setLoading(false);
        } finally {
            clearTimeout(timeoutMessage); // Ensure timeout is cleared no matter what
        }
    };
    
    useEffect(() => {
        const uid = Cookies.get("uid");
    
        if (uid) {
            console.log(`UID detected on mount: ${uid}`);
            router.push("/chat");
        } else {
            setShowStorageAccess(true);
        }
    }, []); // Removed `[router]` dependency to prevent unnecessary re-runs
    

   

    return (
        <div className="p-3 relative">
            {loading && <Loader msg={loadingMsg} />}
            <nav className="flex justify-end"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
</nav>
        <div className="mt-20 text-center">
            
            <motion.div initial={{scale:1,y:0}}>

            <Image className="mx-auto" src={Logo} alt="Logo" width={200} height={200} />
            </motion.div>
            
          <p className="font-thin text-xs mt-2">Stay Connected, Anytime.</p>
          {error && <p className="text-red-500 text-center border border-red-500 mt-4 font-medium p-2 rounded-md">{error}</p>}

       
       <div className="mt-30">
              <Button disabled={loading} onClick={routeToLogin} className="block mt-4 w-4/5 bg-[#4D5FB1] text-white mx-auto h-10">Sign in to account</Button>
              <Button disabled={loading} onClick={handleRouting} className="block mt-8 w-4/5 mx-auto h-10">Sign in anonymously</Button>
       </div>   </div>
          {/* Animate StorageAccessComp when showStorageAccess is true */}
          <AnimatePresence>
  {showStorageAccess && (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between"
    >
        <div className="flex flex-col gap-y-2">

      <StorageAccessRequest />
      <Button onClick={() => setShowStorageAccess((false))} className="text-red-500">
        Close
      </Button>
        </div>
      <p className="text-xs font-thin">Created by Franklin Ebi</p>
    </motion.div>
  )}
</AnimatePresence>

        </div>
    );
}
