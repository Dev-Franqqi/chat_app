'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {useRouter} from 'next/navigation'
import Cookies from "js-cookie"
export default function Startpage(){
    const router = useRouter()
    const [error,setError] = useState('')

    const handleRouting = async () => {
        try {
          console.log('routing');
          
          // Include credentials to ensure cookies are sent and received
          const res = await fetch('http://192.168.0.36:3000/auth/signup', {
            method: 'POST', // assuming POST request, change if needed
            headers: {
              'Content-Type': 'application/json',
              // Add any necessary headers here
            },
            credentials: 'include',  // Ensure cookies are included in the request
          });
          
          if (!res.ok) {
            throw new Error('Failed to sign up');
          }
      
          const data = await res.json();
          
          // After successfully signing up, navigate to the chat page
          router.push('/chat');
        } catch (error) {
          setError('Failed to login. Please try again.');
          console.error(error);
        }
      };
      

    return(<div>
        <div className="  md:w-2/5 mx-auto border-2 bg-teal-200 h-screen  flex flex-col items-center justify-center">
            {error && <p>{error}</p>}
        <Button onClick={handleRouting} className="mx-auto h-18 rounded-xl w-2/5 animate-pulse bg-white text-black font-semibold">Click to start</Button>
        </div>
        
    
    </div>)
}