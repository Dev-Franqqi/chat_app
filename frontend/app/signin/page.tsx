'use client'
import Image from "next/image"
import Logo from "../../components/imgs/biglogo.png"
import { useState ,useEffect} from "react"
import { FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserData } from "../signup/page"
import Cookies from "js-cookie"
import Loader from "@/components/Loadercomp"
import Link from "next/link"
export default function Signin(){
        const [email, setemail] = useState('')
        const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const [loading, setLoading] = useState(false)   
        const [loadingMsg,setLoadingMsg] = useState('')
        const [user,setUser] = useState<UserData>()
        const router = useRouter()
        const handleSubmit =async(e:FormEvent<HTMLFormElement>)=>{
            e.preventDefault()
    
            console.log('submitting')
            setError('')
            setLoading(true)
            const timeoutMessage = setTimeout(() => {
                setLoadingMsg("Hold on! Server is starting up...");
            }, 20000); // 40 seconds
        
            try{
                if(!email || !password){
                    throw new Error("Please fill in all Fields")
                }
    
                const serverurl  = process.env.NEXT_PUBLIC_SERVER_URL
                const response = await fetch(`${serverurl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    credentials:'include'  });
                    clearTimeout(timeoutMessage); 
                    if (!response.ok) {
                        const errorData = await response.json(); // Read error response
                        throw new Error(errorData.message || "Something went wrong");
                    }
                const data:UserData = await response.json()
      
                Cookies.set('token',data.token)
                console.log(data)
                setUser(data)
                setLoading(false)
                return 
                
            }
            catch(error:any){
                console.log(error)
                setError(error.message)
                
                return
            }finally{
                setLoading(false)
                clearTimeout(timeoutMessage)

            }
    
        }
        useEffect(()=>{
            if(user){
             router.push("/chat")
            }
    
        },[user,router])
        return (<div className="relative">
                {loading && <Loader msg={loadingMsg} />}
            <nav className="flex justify-between p-2 items-center">
                <Image src={Logo} alt='' width={100}/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
            </nav>
        
        <main className="px-5 py-20">
            <h1 className="text-center font-bold text-3xl">Sign In</h1>
            {error && <p className="text-red-500 text-center border border-red-500 mt-4 font-medium p-2 rounded-md">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="mt-6">
    
                <label className="text-sm" htmlFor="Email">Email</label>
                <Input value={email} onChange={(e)=>setemail(e.target.value)} className="border-[#4D5FB1] py-3" type='email' required/>
                </div>
                <div className="mt-6">
    
                <label className="text-sm" htmlFor="Password">Password</label>
                <Input value={password} onChange={(e)=>setPassword(e.target.value)} className="border-[#4D5FB1] py-3" type='password' required/>
                </div>
    
                <Button type="submit" disabled={loading} className="block mt-6 cursor-pointer mx-auto w-4/5">SUBMIT</Button>
            </form>
    
        </main>
    
        <footer className="text-center pt-10">
            <p className="text-xs">Don&apos;t have an account? <Link href="/signup" className="text-[#4D5FB1]">Sign up</Link></p>
            <p className="absolute bottom-0 left-[3%] text-xs font-thin">Created by Franklin Ebi</p>
        
        </footer>
        </div>)
    }