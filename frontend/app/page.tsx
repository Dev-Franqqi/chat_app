'use client'
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie"
import { UserData } from "./signup/page"
import Image from 'next/image'
import Logo from '../components/imgs/biglogo.png'
export default function Startpage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const routeToLogin = ()=>{
        router.push('/signin')
    }
    const handleRouting = async () => {
        const uid = Cookies.get('uid');
    
        if (uid) {
            console.log(`User already logged in with UID: ${uid}`);
            router.push("/chat");
            return;
        }
    
        try {
            console.log('Routing started...');
            const serverurl  = process.env.NEXT_PUBLIC_SERVER_URL
            console.log(serverurl)
            const res = await fetch(`${serverurl}/auth/loginAnonymously`, {
                method: 'GET', // Ensure this is the correct method
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensures cookies are sent & received
            });
    
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(`Error ${res.status}: ${errorMessage}`);
            }
    
            const data = await res.json();
            console.log('Signup successful:', data);
            Cookies.set('uid',data.uid)
    
          
    
            router.push("/chat"); // Redirect after successful signup
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'Failed to login. Please try again.');
        }
    };
    

   

    return (
        <div className="p-3">
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
              <Button onClick={routeToLogin} className="block mt-4 w-4/5 bg-[#4D5FB1] text-white mx-auto h-10">Sign in to account</Button>
              <Button onClick={handleRouting} className="block mt-8 w-4/5 mx-auto h-10">Sign in anonymously</Button>
       </div>   </div>
       <p className="absolute bottom-0 left-[3%] text-xs font-thin">Created by Franklin Ebi</p>
        </div>
    );
}
