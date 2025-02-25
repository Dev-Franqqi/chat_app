'use client'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie"
export default function Startpage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [cookiestate,setCookiestate] = useState(false)

    const handleRouting = async () => {
        const uid = Cookies.get('uid');
    
        if (uid) {
            console.log(`User already logged in with UID: ${uid}`);
            router.push("/chat");
            return;
        }
    
        try {
            console.log('Routing started...');
    
            const res = await fetch('http://192.168.0.182:3000/auth/signup', {
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
    
            // Set cookie correctly
            Cookies.set('uid', data.uid, { path: '/' }); 
            setCookiestate(true);
    
            router.push("/chat"); // Redirect after successful signup
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'Failed to login. Please try again.');
        }
    };
    

    useEffect(()=>{
      cookiestate && router.push('/chat')
    },[cookiestate])

    return (
        <div>
            <div className="md:w-2/5 mx-auto border-2 bg-teal-200 h-screen flex flex-col items-center justify-center">
                {error && <p className="text-red-600">{error}</p>}
                <Button onClick={handleRouting} className="mx-auto h-18 rounded-xl w-2/5 animate-pulse bg-white text-black font-semibold">
                    Click to start
                </Button>
            </div>
        </div>
    );
}
